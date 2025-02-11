// app/api/confirmation/route.ts
import { NextResponse, NextRequest } from "next/server";
import connectDB from "@/config/db";
import Transaction from "@/models/Transaction"; // Import the Transaction model

export async function POST(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Parse the request body
    const body = await request.json();
    console.log("Incoming transaction data:", body);

    // Extract relevant fields from the request body
    const { TransactionID, Amount, MSISDN, BillRefNumber } = body;

    // Create a new transaction document
    const newTransaction = new Transaction({
      transactionId: TransactionID, // Safaricom's transaction ID
      amount: Amount, // The transaction amount
      phoneNumber: MSISDN, // The customer's phone number
      accountNumber: BillRefNumber, // The account number (BillRefNumber)
      status: "pending", // Default status
    });

    // Save the transaction to the database
    await newTransaction.save();

    console.log("Transaction saved to database:", newTransaction);

    // Return a success response
    return NextResponse.json(
      { message: "Transaction saved successfully", data: newTransaction },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error saving transaction:", error);
    return NextResponse.json(
      { message: "❌ Failed to process confirmation", error: error },
      { status: 500 },
    );
  }
}
