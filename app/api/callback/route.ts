import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Voucher from "@/models/voucherSchema";
import HotspotTransactions from "@/models/HotspotTransactions";
import { mikrotikApi } from "@/config/mikrotikApi";
import generateVoucher from "@/utils/voucherGenerator";

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure database connection
    console.log("✅ Connected to MongoDB");

    const callbackData = await req.json();
    console.log("📩 Callback Data:", JSON.stringify(callbackData, null, 2));

    const {
      Body: {
        stkCallback: { CheckoutRequestID, ResultCode, CallbackMetadata },
      },
    } = callbackData;

    if (ResultCode === 0) {
      // Payment was successful
      console.log(
        "✅ Payment successful for CheckoutRequestID:",
        CheckoutRequestID,
      );

      // Find the temporary transaction
      const transaction = await HotspotTransactions.findOne({
        checkoutRequestID: CheckoutRequestID,
      });
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      // Generate voucher (name)
      let voucherCode;
      let isVoucherUnique = false;
      while (!isVoucherUnique) {
        voucherCode = generateVoucher();
        console.log("Generated Voucher Code:", voucherCode);

        // Check if the voucher code already exists
        const existingVoucher = await Voucher.findOne({ name: voucherCode });
        if (!existingVoucher) {
          isVoucherUnique = true;
        }
      }

      // Update transaction with voucher code and status
      transaction.mpesaReceiptNumber = voucherCode;
      transaction.status = "Completed";
      await transaction.save();
      console.log("✅ Transaction updated in MongoDB");

      // Store voucher in MongoDB
      try {
        // Get the current date in East African Time (EAT)
        const localDate = new Date();
        const offset = localDate.getTimezoneOffset() * 60000; // Convert offset to milliseconds
        const eastAfricanTime = new Date(localDate.getTime() + 3 * 3600000); // Add 3 hours for EAT (UTC+3)
        const localISOTime = eastAfricanTime.toISOString(); // Convert to ISO string

        await Voucher.create({
          name: voucherCode,
          password: "EASETELL",
          profile: transaction.accountNumber, // Set profile field to accountNumber
          phoneNumber: transaction.phoneNumber,
          checkoutRequestID: CheckoutRequestID,
          status: "Unused",
          createdAt: localISOTime, // Store local time in the database
        });
        console.log("✅ Voucher stored in MongoDB");
      } catch (error) {
        console.error("❌ Error storing voucher in MongoDB:", error);
        throw error;
      }

      // Add the user to MikroTik Hotspot
      await mikrotikApi.connect();

      // Format the local date and time for East African Time (EAT)
      const formattedDate = new Date().toLocaleString("en-US", {
        timeZone: "Africa/Nairobi", // Use East African Time (EAT)
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format (AM/PM)
      });

      const mikrotikResult = await mikrotikApi.write("/ip/hotspot/user/add", [
        `=server=lamutell`, // Server
        `=name=${voucherCode}`, // Fixed username for all clients
        `=password=EASETELL`, // Unique password per voucher
        `=profile=${transaction.accountNumber}`, // Adjust profile as needed
        `=comment=${formattedDate}`, // Store the formatted local date and time
      ]);

      console.log("✅ Voucher added to MikroTik:", mikrotikResult);

      await mikrotikApi.close();

      console.log(
        `✅ Voucher Generated: ${voucherCode} for ${transaction.phoneNumber}`,
      );

      return NextResponse.json(
        { success: true, message: "Voucher generated successfully." },
        { status: 200 },
      );
    } else {
      // Payment failed
      console.error(
        "❌ Payment failed for CheckoutRequestID:",
        CheckoutRequestID,
      );

      // Update transaction status to "Failed"
      const transaction = await HotspotTransactions.findOne({
        checkoutRequestID: CheckoutRequestID,
      });
      if (transaction) {
        transaction.status = "Failed";
        await transaction.save();
        console.log("✅ Transaction updated to 'Failed' in MongoDB");
      }

      return NextResponse.json(
        { success: false, message: "Payment failed." },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("❌ Callback Error:", error);
    return NextResponse.json(
      { success: false, message: "Callback processing failed." },
      { status: 500 },
    );
  }
}
