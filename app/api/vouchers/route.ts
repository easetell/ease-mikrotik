import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import connectDB from "@/config/db";
import Voucher from "@/models/voucherSchema";

// GET route to fetch all
export const revalidate = 0; // Ensures fresh data

export async function GET() {
  console.log("Fetching vouchers...");

  await connectDB(); // Ensure database is connected

  try {
    const vouchers = await Voucher.find({}).lean(); // Use lean() for performance
    console.log("Fetched vouchers count:", vouchers.length);

    return NextResponse.json(
      { vouchers },
      {
        status: 200,
        headers: { "Cache-Control": "no-store" }, // Prevents Next.js from caching responses
      },
    );
  } catch (error) {
    console.error("Failed to fetch vouchers:", error);
    return NextResponse.json(
      { message: "Failed to fetch vouchers" },
      { status: 500 },
    );
  }
}
