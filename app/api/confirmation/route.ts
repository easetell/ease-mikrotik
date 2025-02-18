import { NextRequest, NextResponse } from "next/server";
import { reconnectClient } from "@/config/reconnectClient";
import MikCustomers from "@/models/MikCustomers"; // Import the Customer model
import connectDB from "@/config/db"; // Import database connection utility

export async function POST(req: NextRequest) {
  try {
    // Step 1: Connect to the database
    await connectDB();

    // Step 2: Extract payment details from the request body
    const body = await req.json(); // Parse the JSON body
    const {
      TransID,
      TransAmount,
      BillRefNumber, // This is the client's username or account number
      MSISDN,
      FirstName,
      LastName,
    } = body;

    console.log(`Received payment from ${FirstName} ${LastName} (${MSISDN})`);
    console.log(`Transaction ID: ${TransID}, Amount: ${TransAmount}`);

    // Step 3: Find the client in the database using BillRefNumber (username)
    const client = await MikCustomers.findOne({ name: BillRefNumber });
    if (!client) {
      throw new Error(`Client ${BillRefNumber} not found in the database.`);
    }

    // Step 4: Update the client's last payment details and status
    client.lastPayment = {
      amount: parseFloat(TransAmount),
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

    // Step 5: Reconnect the client on MikroTik
    await reconnectClient(BillRefNumber);
    console.log(`Client ${BillRefNumber} reconnected successfully.`);

    // Step 6: Respond to M-Pesa with a success message
    return NextResponse.json(
      {
        ResultCode: "0",
        ResultDesc: "Success",
      },
      { status: 200 },
    );
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
