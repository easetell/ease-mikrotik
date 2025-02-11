// app/api/pppoe-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import connectDB from "@/config/db";
import Transaction from "@/models/Transaction";

// GET route to fetch all transactions
export async function GET() {
  await connectDB();

  try {
    const transactions = await Transaction.find({});
    return NextResponse.json({ transactions }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch transactions:", error);
    return NextResponse.json(
      { message: "Failed to fetch transactions" },
      { status: 500 },
    );
  }
}
