import { NextResponse } from "next/server";
import connectDB from "@/config/db";
import Voucher from "@/models/voucherSchema";
import HotspotTransactions from "@/models/HotspotTransactions";
import { mikrotikApi } from "@/config/mikrotikApi";
import generateVoucher from "@/utils/voucherGenerator";
import axios from "axios";

interface Profile {
  name: string;
  "session-timeout": string; // Use string if session-timeout is in the format "2h", "30m", etc.
  // Add other properties if needed
}

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

      // Fetch the profile details
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/hotspot-plans`,
      );
      const profiles = response.data;

      // Find the profile matching the accountNumber
      const profile = profiles.find(
        (p: Profile) => p.name === transaction.accountNumber,
      );
      if (!profile) {
        throw new Error("Profile not found");
      }

      // Get the session-timeout from the profile
      const sessionTimeout = profile["session-timeout"]; // e.g., "2h"

      // Calculate the expiry time
      const now = new Date();
      const expiryTime = new Date(
        now.getTime() + parseSessionTimeout(sessionTimeout),
      );

      // Format the expiry time for the comment field
      const formattedExpiryTime = expiryTime.toLocaleString("en-US", {
        timeZone: "Africa/Nairobi", // Use East African Time (EAT)
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true, // Use 12-hour format (AM/PM)
      });

      // Store voucher in MongoDB
      await Voucher.create({
        name: voucherCode,
        password: "EASETELL",
        profile: transaction.accountNumber, // Set profile field to accountNumber
        phoneNumber: transaction.phoneNumber,
        checkoutRequestID: CheckoutRequestID,
        status: "Unused",
        createdAt: new Date(), // Current time
        expiryTime: expiryTime, // Calculated expiry time
      });
      console.log("✅ Voucher stored in MongoDB");

      // Add the user to MikroTik Hotspot
      await mikrotikApi.connect();
      console.log("✅ Connected to MikroTik");

      const mikrotikResult = await mikrotikApi.write("/ip/hotspot/user/add", [
        `=server=lamutell`, // Server
        `=name=${voucherCode}`, // Fixed username for all clients
        `=password=EASETELL`, // Unique password per voucher
        `=profile=${transaction.accountNumber}`, // Adjust profile as needed
        `=comment=${formattedExpiryTime}`, // Store the formatted expiry time
      ]);

      console.log("✅ Voucher added to MikroTik:", mikrotikResult);

      await mikrotikApi.close();
      console.log("✅ Disconnected from MikroTik");

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

function parseSessionTimeout(timeout: string): number {
  const unit = timeout.slice(-1); // Get the last character (h, m, s)
  const value = parseInt(timeout.slice(0, -1)); // Get the numeric value

  if (isNaN(value)) {
    throw new Error(`Invalid session-timeout value: ${timeout}`);
  }

  switch (unit) {
    case "h": // Hours
      return value * 60 * 60 * 1000;
    case "m": // Minutes
      return value * 60 * 1000;
    case "s": // Seconds
      return value * 1000;
    default:
      throw new Error(`Invalid session-timeout unit: ${unit}`);
  }
}
