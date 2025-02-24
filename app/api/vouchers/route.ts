import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import connectDB from "@/config/db";
import AllVoucher from "@/models/AllVouchers";

// GET route to fetch all vouchers
export async function GET() {
  await connectDB();

  try {
    const vouchers = await AllVoucher.find({});
    return NextResponse.json({ vouchers }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return NextResponse.json(
      { message: "Failed to fetch vouchers" },
      { status: 500 },
    );
  }
}
