// app/api/pppoe-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RouterOSAPI } from "node-routeros";
import "source-map-support/register";
import connectDB from "@/config/db";
import MikCustomers, { ICustomer } from "@/models/MikCustomers";

const api = new RouterOSAPI({
  host: process.env.ROUTER_IP || "",
  user: process.env.USER_NAME,
  password: process.env.ROUTER_PASSWORD,
  port: 8728,
});

async function connectToApi() {
  await api.connect();
}

async function disconnectFromApi() {
  await api.close();
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
    "caller-id": callerId,
  } = await req.json();

  try {
    await connectToApi();
    const mikrotikResult = await api.write("/ppp/secret/add", [
      `=name=${name}`,
      `=password=${password}`,
      `=profile=${profile}`,
      `=service=${service}`,
      `=caller-id=${callerId}`,
    ]);
    await disconnectFromApi();

    // Ensure the response has the expected format
    if (mikrotikResult && mikrotikResult.length > 0 && mikrotikResult[0].ret) {
      const mikrotikId = mikrotikResult[0].ret; // Assuming 'ret' contains the ID

      await connectDB();

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
