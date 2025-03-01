import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import { mikrotikApi } from "@/config/mikrotikApi";
import connectDB from "@/config/db";
import Voucher from "@/models/voucherSchema";

async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

// GET route to fetch all
export const revalidate = 0; // Ensures fresh data

export async function GET() {
  console.log("Fetching vouchers...");

  await connectDB(); // Ensure database is connected

  try {
    const vouchers = await Voucher.find({}).lean(); // Use lean() for performance

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

//Add Voucher Manually
export async function POST(req: NextRequest) {
  const {
    name,
    password,
    profile,
    phoneNumber,
    checkoutRequestID,
    expiryTime,
  } = await req.json();

  try {
    // Format expiry time for Nairobi Timezone
    const formattedExpiryTime = new Date(expiryTime).toLocaleString("en-US", {
      timeZone: "Africa/Nairobi",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // AM/PM format
    });

    await connectDB();

    // Store voucher in MongoDB
    const voucher = await Voucher.create({
      name,
      password,
      profile,
      phoneNumber,
      checkoutRequestID,
      status: "Active",
      createdAt: new Date(),
      expiryTime,
    });

    console.log("✅ Voucher stored in MongoDB");

    // Connect to MikroTik
    await connectToApi();
    console.log("✅ Connected to MikroTik");

    // Add the user to MikroTik Hotspot
    const mikrotikResult = await mikrotikApi.write("/ip/hotspot/user/add", [
      `=server=easebill`, // Server
      `=name=${name}`, // Voucher name
      `=password=${password}`, // Static password
      `=profile=${profile}`, // Profile based on account number
      `=comment=${formattedExpiryTime}`, // Store formatted expiry time
    ]);

    console.log("✅ Voucher added to MikroTik:", mikrotikResult);

    // Disconnect from MikroTik
    await disconnectFromApi();
    console.log("✅ Disconnected from MikroTik");

    return NextResponse.json(
      {
        message: "Voucher created successfully",
        voucher,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create voucher:", error);
    return NextResponse.json(
      { message: "Failed to create voucher" },
      { status: 500 },
    );
  }
}
