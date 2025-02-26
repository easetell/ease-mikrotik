import { NextResponse } from "next/server";
import Voucher from "@/models/voucherSchema";
import connectDB from "@/config/db";

export async function GET(req: Request) {
  try {
    await connectDB(); // Ensure database connection

    // Use req.nextUrl to access query parameters
    const { searchParams } = new URL(req.url);
    const checkoutRequestID = searchParams.get("checkoutRequestID");

    console.log("Fetching voucher for CheckoutRequestID:", checkoutRequestID); // Log CheckoutRequestID

    if (!checkoutRequestID) {
      return NextResponse.json(
        { success: false, message: "CheckoutRequestID is required" },
        { status: 400 },
      );
    }

    // Find the voucher for the given CheckoutRequestID
    const voucher = await Voucher.findOne({ checkoutRequestID }).exec();

    if (!voucher) {
      console.error(
        "❌ Voucher not found for CheckoutRequestID:",
        checkoutRequestID,
      );
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 },
      );
    }

    console.log("✅ Voucher found:", voucher); // Log the fetched voucher

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
