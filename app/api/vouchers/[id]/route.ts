import { NextResponse, NextRequest } from "next/server";
import Voucher from "@/models/voucherSchema";
import connectDB from "@/config/db";

// Get single Voucher by checkoutRequestID
export async function GET(request: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(request.url);
  const checkoutRequestID = searchParams.get("checkoutRequestID");

  if (!checkoutRequestID) {
    return NextResponse.json(
      { message: "checkoutRequestID is required" },
      { status: 400 },
    );
  }

  try {
    const voucher = await Voucher.findOne({ checkoutRequestID });
    if (!voucher) {
      return NextResponse.json(
        { message: "Voucher not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ voucher }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Voucher:", error);
    return NextResponse.json(
      { message: "Failed to fetch Voucher" },
      { status: 500 },
    );
  }
}
