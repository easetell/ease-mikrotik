// app/api/getVoucher/route.js
import { NextResponse } from "next/server";
import Voucher from "@/models/voucherSchema";
import connectDB from "@/config/db";

export async function GET(req: Request) {
  try {
    await connectDB(); // Ensure database connection

    const { searchParams } = new URL(req.url);
    const phone = searchParams.get("phone");

    if (!phone) {
      return NextResponse.json(
        { success: false, message: "Phone number is required" },
        { status: 400 },
      );
    }

    // Find the voucher for the given phone number
    const voucher = await Voucher.findOne({ phoneNumber: phone }).sort({
      createdAt: -1,
    }); // Get the latest voucher

    if (!voucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        name: voucher.name, // Return the username
        password: voucher.password, // Return the password (voucher)
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Error fetching voucher:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching voucher" },
      { status: 500 },
    );
  }
}
