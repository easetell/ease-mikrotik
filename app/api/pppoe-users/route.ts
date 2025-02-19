import { NextRequest, NextResponse } from "next/server";
import { mikrotikApi } from "@/config/mikrotikApi";
import "source-map-support/register";
import connectDB from "@/config/db";
import MikCustomers, { ICustomer } from "@/models/MikCustomers";

async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

// GET route to fetch all mikcustomers
export async function GET() {
  await connectDB();

  try {
    const mikcustomers = await MikCustomers.find({});
    return NextResponse.json({ mikcustomers }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch mikcustomers:", error);
    return NextResponse.json(
      { message: "Failed to fetch mikcustomers" },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  const {
    name,
    password,
    service,
    profile,
    firstName,
    lastName,
    phoneNumber,
    expiryDate,
    location,
    idNumber,
    status,
    "caller-id": callerId,
  } = await req.json();

  try {
    await connectToApi();

    // Set the comment field to the expiryDate
    const comment = expiryDate.toISOString(); // Convert expiryDate to ISO string

    // Add the comment field to the MikroTik API call
    const mikrotikResult = await mikrotikApi.write("/ppp/secret/add", [
      `=name=${name}`,
      `=password=${password}`,
      `=profile=${profile}`,
      `=service=${service}`,
      `=caller-id=${callerId}`,
      `=comment=${comment}`, // Set comment to expiryDate
    ]);

    await disconnectFromApi();

    // Ensure the response has the expected format
    if (mikrotikResult && mikrotikResult.length > 0 && mikrotikResult[0].ret) {
      const mikrotikId = mikrotikResult[0].ret; // Assuming 'ret' contains the ID

      await connectDB();

      // Include the comment field when saving to the database
      const pppoecustomer = new MikCustomers({
        mikrotikId,
        name,
        password,
        service,
        "caller-id": callerId,
        firstName,
        lastName,
        phoneNumber,
        profile,
        expiryDate,
        location,
        idNumber,
        status,
        comment, // Set comment to expiryDate
      });

      await pppoecustomer.save();

      return NextResponse.json(
        {
          message: "pppoeCustomer created successfully",
          pppoeCustomer: pppoecustomer,
        },
        { status: 201 },
      );
    } else {
      throw new Error("Invalid MikroTik API response");
    }
  } catch (error) {
    console.error("Failed to create pppoeCustomer:", error);
    return NextResponse.json(
      { message: "Failed to create pppoeCustomer" },
      { status: 500 },
    );
  }
}
