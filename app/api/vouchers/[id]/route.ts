import { NextRequest, NextResponse } from "next/server";
import Voucher from "@/models/voucherSchema";
import connectDB from "@/config/db";
import { mikrotikApi } from "@/config/mikrotikApi";

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
      console.error("❌ CheckoutRequestID is required");
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

// Update single voucher
export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();
    const { id } = params;
    const { expiryTime } = await req.json(); // Receive expiryTime from the request

    // Update the voucher in the database
    const updatedVoucher = await Voucher.findOneAndUpdate(
      { checkoutRequestID: id }, // Find the voucher by checkoutRequestID
      { expiryTime }, // Update the expiryTime field
      { new: true }, // Return the updated document
    );

    if (!updatedVoucher) {
      return NextResponse.json(
        { success: false, message: "Voucher not found" },
        { status: 404 },
      );
    }

    // Re-add the voucher to MikroTik with the updated expiry time as the comment
    await mikrotikApi.connect();
    console.log("✅ Connected to MikroTik");

    const mikrotikResult = await mikrotikApi.write("/ip/hotspot/user/add", [
      `=server=easebill`, // Server
      `=name=${updatedVoucher.name}`, // Voucher name
      `=password=${updatedVoucher.password}`, // Voucher password
      `=profile=${updatedVoucher.profile}`, // Voucher profile
      `=comment=${expiryTime}`, // Updated expiry time as comment
    ]);

    console.log("✅ Voucher re-added to MikroTik:", mikrotikResult);

    await mikrotikApi.close();
    console.log("✅ Disconnected from MikroTik");

    return NextResponse.json(
      { success: true, data: updatedVoucher },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating voucher:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update voucher" },
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
