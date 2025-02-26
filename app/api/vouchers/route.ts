// GET route to fetch all
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/config/db";
import Voucher from "@/models/voucherSchema";

// GET route to fetch all vouchers
export async function GET(request: NextRequest) {
  try {
    // Connect to the database
    await connectDB();

    // Fetch all vouchers
    const vouchers = await Voucher.find({});

    // Disable caching (optional)
    const headers = {
      "Cache-Control": "no-store, max-age=0",
      Pragma: "no-cache",
    };

    // Return the vouchers
    return NextResponse.json({ vouchers }, { status: 200, headers });
  } catch (error) {
    // Log the error for debugging
    console.error("Failed to fetch vouchers:", error);

    // Return a generic error message
    return NextResponse.json(
      { message: "Failed to fetch vouchers", error },
      { status: 500 },
    );
  }
}
