import { NextRequest, NextResponse } from "next/server";
import Voucher from "@/models/voucherSchema";
import { mikrotikApi } from "@/config/mikrotikApi";
import HotspotTransactions from "@/models/HotspotTransactions";
import generateVoucher from "@/utils/voucherGenerator"; // Ensure correct import
import connectDB from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Ensure database connection

    const payload = await req.json();
    console.log("📩 Incoming STK Callback:", JSON.stringify(payload, null, 2));

    // Validate M-Pesa payment response
    if (payload.Body?.stkCallback?.ResultCode !== 0) {
      const errorMessage =
        payload.Body?.stkCallback?.ResultDesc || "Payment failed";

      // Handle specific error: DS timeout user cannot be reached
      if (payload.Body?.stkCallback?.ResultCode === 1037) {
        console.error(
          "❌ Payment Callback Error: User did not respond to STK push.",
        );
        return NextResponse.json(
          {
            success: false,
            message:
              "Payment failed: User did not respond to the payment prompt.",
          },
          { status: 400 },
        );
      }

      // Handle other errors
      throw new Error(errorMessage);
    }

    const metadata = payload.Body.stkCallback.CallbackMetadata?.Item;
    if (!metadata) throw new Error("Invalid Callback Metadata");

    // Extract necessary payment details
    const amount = metadata.find((item: any) => item.Name === "Amount")?.Value;
    const mpesaReceiptNumber =
      metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value ||
      metadata.find((item: any) => item.Name === "MpesaReceiptNumber")?.Value; // Handle both spellings
    const phoneNumber = metadata.find(
      (item: any) => item.Name === "PhoneNumber",
    )?.Value;
    const accountNumber = metadata.find(
      (item: any) => item.Name === "AccountReference",
    )?.Value;
    const checkoutRequestID = payload.Body.stkCallback.CheckoutRequestID; // Get the CheckoutRequestID

    console.log("Extracted Data:", {
      amount,
      mpesaReceiptNumber,
      phoneNumber,
      accountNumber,
      checkoutRequestID,
    }); // Log extracted data

    if (!amount || !mpesaReceiptNumber || !phoneNumber || !checkoutRequestID) {
      throw new Error("Missing required payment details");
    }

    // If AccountReference is missing, use phoneNumber as a fallback
    const accountReference = accountNumber || phoneNumber;

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

    // Store transaction in MongoDB
    await HotspotTransactions.create({
      phoneNumber,
      accountNumber: accountReference,
      amount,
      mpesaReceiptNumber,
      voucherCode, // Use the same voucherCode
      checkoutRequestID, // Store the CheckoutRequestID
      status: "Success",
    });

    // Store voucher in MongoDB
    await Voucher.create({
      name: voucherCode, // Default username
      password: "EASETELL", // Default Password
      phoneNumber,
      checkoutRequestID, // Store the CheckoutRequestID
      status: "Unused",
    });

    // Add the user to MikroTik Hotspot
    await mikrotikApi.connect();

    const mikrotikResult = await mikrotikApi.write("/ip/hotspot/user/add", [
      `=server=lamutell`, // Server
      `=name=${voucherCode}`, // Fixed username for all clients
      `=password=EASETELL`, // Unique password per voucher
      `=profile=default`, // Adjust profile as needed
      `=limit-uptime=1h`, // Fixed 1-hour limit
      `=comment=1h`, // Optional: Store the limit in the comment field
    ]);

    console.log("✅ Voucher added to MikroTik:", mikrotikResult);

    await mikrotikApi.close();

    console.log(`✅ Voucher Generated: ${voucherCode} for ${phoneNumber}`);

    return NextResponse.json(
      {
        success: true,
        message: "Payment successful. Voucher sent!",
        voucher: voucherCode,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Payment Callback Error:", error.message || error);
    return NextResponse.json(
      { success: false, message: error.message || "Error processing payment." },
      { status: 400 },
    );
  }
}
