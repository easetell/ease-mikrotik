import { NextRequest, NextResponse } from "next/server";
import Voucher from "@/models/voucherSchema";
import connectDB from "@/config/db";

// Type for the request parameters
interface Params {
  id: string;
}

export async function GET(req: Request) {
  try {
    await connectDB(); // Ensure database connection

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
    const voucher = await Voucher.findOne({ checkoutRequestID })
      .sort({ createdAt: -1 }) // Sort by createdAt in descending order
      .exec();

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

// Delete single voucher
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    await connectDB();
    const voucher = await Voucher.findOneAndDelete({ checkoutRequestID: id });

    if (!voucher) {
      return NextResponse.json(
        { message: "voucher not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(voucher, { status: 200 });
  } catch (error) {
    console.error("Failed to delete voucher:", error);
    return NextResponse.json(
      { message: "Failed to delete voucher" },
      { status: 500 },
    );
  }
}
