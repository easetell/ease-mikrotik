import { NextResponse } from "next/server";
import { enableClient } from "@/config/enableClient"; // Function to enable PPPoE user
import MikCustomers from "@/models/MikCustomers";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("📩 Received M-Pesa Payment:", body);

    const { TransID, TransAmount, MSISDN, BillRefNumber } = body;

    // BillRefNumber is the PPPoE Username
    const client = await MikCustomers.findOne({ name: BillRefNumber });

    if (!client) {
      console.warn(`⚠ No client found for PPPoE user: ${BillRefNumber}`);
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Enable the user in MikroTik
    await enableClient(client.name);

    // Update user status in database
    client.lastPayment = {
      amount: TransAmount,
      transactionId: TransID,
      phone: MSISDN,
      date: new Date(),
    };
    await client.save();

    console.log(
      `✅ User ${client.name} enabled after payment of KES ${TransAmount}`,
    );

    return NextResponse.json({
      success: true,
      message: "User enabled successfully",
    });
  } catch (error) {
    console.error("❌ M-Pesa Confirmation Error:", error);
    return NextResponse.json(
      { message: "Failed to process payment" },
      { status: 500 },
    );
  }
}
