import { NextResponse } from "next/server";
import Transaction from "@/models/Transaction";

export async function POST(request: Request) {
  try {
    // Step 1: Parse the request body
    const payload = await request.json();
    console.log("Incoming payload:", JSON.stringify(payload, null, 2));

    // Step 2: Extract transaction details
    const transactionId = payload.Body.stkCallback.CallbackMetadata.Item.find(
      (item: any) => item.Name === "MpesaReceiptNumber",
    ).Value;
    const amount = payload.Body.stkCallback.CallbackMetadata.Item.find(
      (item: any) => item.Name === "Amount",
    ).Value;
    const phoneNumber = payload.Body.stkCallback.CallbackMetadata.Item.find(
      (item: any) => item.Name === "PhoneNumber",
    ).Value;
    const accountNumber = payload.Body.stkCallback.CallbackMetadata.Item.find(
      (item: any) => item.Name === "AccountNumber",
    ).Value;

    // Step 3: Log the transaction in the database
    const transaction = new Transaction({
      transactionId,
      amount,
      phoneNumber,
      accountNumber,
      status: "pending",
    });
    await transaction.save();

    console.log(`✅ Transaction logged: ${transactionId}`);
    return NextResponse.json(
      { success: true, message: "Transaction logged successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Error logging transaction:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 400 },
    );
  }
}
