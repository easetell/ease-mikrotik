import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import connectDB from "@/config/db";
import Voucher from "@/models/voucherSchema";

// GET route to fetch all
export async function GET() {
  await connectDB();

  try {
    const vouchers = await Voucher.find({});
    return NextResponse.json({ vouchers }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return NextResponse.json(
      { message: "Failed to fetch vouchers" },
      { status: 500 },
    );
  }
}
