// app/api/pppoe-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import mikrotikApi from "@/config/mikrotikApi";
import "source-map-support/register";
import connectDB from "@/config/db";
import MikCustomers, { ICustomer } from "@/models/MikCustomers";

// Type for the request parameters
interface Params {
  id: string;
}

async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

//Get single PPPoE
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  await connectDB();

  const { id } = params;

  try {
    const mikcustomer = await MikCustomers.findOne({ mikrotikId: id });
    if (!mikcustomer) {
      return NextResponse.json(
        { message: "Mikcustomer not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ mikcustomer }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Mikcustomer:", error);
    return NextResponse.json(
      { message: "Failed to fetch Mikcustomer" },
      { status: 500 },
    );
  }
}

//PUT PPPoE
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const {
    name,
    password,
    profile,
    "caller-id": callerId,
    firstName,
    lastName,
    phoneNumber,
    expiryDate,
    location,
    idNumber,
  } = await req.json();

  const { id } = params;

  try {
    await connectToApi();
    const mikrotikResult = await mikrotikApi.write(
      "/ppp/secret/set",
      [
        `=.id=${id}`,
        name ? `=name=${name}` : "",
        password ? `=password=${password}` : "",
        profile ? `=profile=${profile}` : "",
        callerId ? `=caller-id=${callerId}` : "",
      ].filter(Boolean),
    );
    await disconnectFromApi();

    await connectDB();
    const mikcustomer = await MikCustomers.findOneAndUpdate(
      { mikrotikId: id },
      {
        name,
        password,
        profile,
        "caller-id": callerId,
        firstName,
        lastName,
        phoneNumber,
        expiryDate,
        location,
        idNumber,
      },
      { new: true },
    );

    return NextResponse.json(mikcustomer);
  } catch (error) {
    console.error(error);
    await disconnectFromApi();
    return NextResponse.json(
      { error: "Failed to update data in MikroTik" },
      { status: 500 },
    );
  }
}

//Delete PPPoE
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    await connectToApi();
    const mikrotikResult = await mikrotikApi.write("/ppp/secret/remove", [
      `=.id=${id}`,
    ]);
    await disconnectFromApi();

    await connectDB();
    const customer = await MikCustomers.findOneAndDelete({ mikrotikId: id });

    return NextResponse.json(customer);
  } catch (error) {
    console.error(error);
    await disconnectFromApi();
    return NextResponse.json(
      { error: "Failed to delete data from MikroTik" },
      { status: 500 },
    );
  }
}
