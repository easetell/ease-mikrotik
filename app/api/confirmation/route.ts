import { NextRequest, NextResponse } from "next/server";
import { reconnectClient } from "@/config/reconnectClient";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
import Transaction from "@/models/Transaction"; // Import the Transaction model
import connectDB from "@/config/db";

export async function POST(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await connectDB();

    // Step 2: Extract payment details from the request body
    const {
      TransID,
      TransAmount,
      BillRefNumber, // This is the client's username or account number
      MSISDN,
      FirstName,
      LastName,
    } = await req.json();

    console.log(`Received payment from ${FirstName} ${LastName} (${MSISDN})`);
    console.log(`Transaction ID: ${TransID}, Amount: ${TransAmount}`);

    // Step 3: Save the transaction details in the transactions collection
    const transaction = new Transaction({
      transactionId: TransID,
      amount: parseFloat(TransAmount),
      phoneNumber: MSISDN,
      accountNumber: BillRefNumber,
      status: "processed", // Set status to "processed" since we're handling it immediately
    });
    await transaction.save();
    console.log(`Transaction saved: ${TransID}`);

    // Step 4: Find the client in the database using BillRefNumber (username)
    const client = await MikCustomers.findOne({ name: BillRefNumber });
    if (!client) {
      throw new Error(`Client ${BillRefNumber} not found in the database.`);
    }

    // Step 5: Fetch the billing plan for the client's profile
    const billingPlan = await BillingPlans.findOne({ name: client.profile });
    if (!billingPlan) {
      throw new Error(`Billing plan for profile ${client.profile} not found.`);
    }

    // Step 6: Check if the payment is sufficient
    const requiredAmount = billingPlan.price; // Use the price from the billing plan
    const paymentAmount = parseFloat(TransAmount);

    if (paymentAmount >= requiredAmount) {
      // Step 7: Update the client's last payment details and status
      client.lastPayment = {
        amount: paymentAmount,
        transactionId: TransID,
        phone: MSISDN,
        date: new Date(),
      };
      client.status = "active"; // Set status to active after payment
      await client.save();
      console.log(
        `Updated last payment for ${BillRefNumber}:`,
        client.lastPayment,
      );

      // Step 8: Reconnect the client on MikroTik
      await reconnectClient(BillRefNumber);
      console.log(`Client ${BillRefNumber} reconnected successfully.`);

      // Step 9: Respond to M-Pesa with a success message
      return NextResponse.json(
        {
          ResultCode: "0",
          ResultDesc: "Success",
        },
        { status: 200 },
      );
    } else {
      console.log(
        `Payment of ${paymentAmount} is insufficient for ${BillRefNumber}. Required amount: ${requiredAmount}`,
      );
      return NextResponse.json(
        {
          ResultCode: "C2B00013", // Invalid Amount
          ResultDesc: "Insufficient payment",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error processing payment confirmation:", error);

    // Respond to M-Pesa with an error message
    return NextResponse.json(
      {
        ResultCode: "C2B00016", // Other Error
        ResultDesc: "Failed to process payment",
      },
      { status: 500 },
    );
  }
}
