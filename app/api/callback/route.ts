import { NextRequest, NextResponse } from "next/server";
import Voucher from "@/models/voucherSchema";
import HotspotTransactions from "@/models/HotspotTransactions";
import { generateVoucher } from "@/utils/voucherGenerator";
import connectDB from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    await connectDB(); // Ensure database connection

    const payload = await req.json();
    console.log("📩 Incoming STK Callback:", JSON.stringify(payload, null, 2));

    // Validate M-Pesa payment response
    if (payload.Body?.stkCallback?.ResultCode !== 0) {
      throw new Error(
        payload.Body?.stkCallback?.ResultDesc || "Payment failed",
      );
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

    console.log("Extracted Data:", {
      amount,
      mpesaReceiptNumber,
      phoneNumber,
      accountNumber,
    }); // Log extracted data

    if (!amount || !mpesaReceiptNumber || !phoneNumber) {
      throw new Error("Missing required payment details");
    }

    // If AccountReference is missing, use phoneNumber as a fallback
    const accountReference = accountNumber || phoneNumber;

    // Generate a unique voucher
    const voucherCode = generateVoucher();

    // Store transaction in MongoDB
    await HotspotTransactions.create({
      phoneNumber,
      accountNumber: accountReference,
      amount,
      mpesaReceiptNumber,
      voucherCode,
      status: "Success",
    });

    // Store voucher in MongoDB
    await Voucher.create({
      code: voucherCode,
      phoneNumber,
      status: "Unused",
    });

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
