// app/api/pppoe-users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { RouterOSAPI } from "node-routeros";
import "source-map-support/register";
import connectDB from "@/config/db";
import MikCustomers, { ICustomer } from "@/models/MikCustomers";

// Type for the request parameters
interface Params {
  id: string;
}

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

//Get single PPPoE
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  const { id } = params;

  try {
    await connectToApi();
    let result;
    if (id) {
      result = await api.write("/ppp/secret/print", [`?.id=${id}`]);
    } else {
      result = await api.write("/ppp/secret/print");
    }
    await disconnectFromApi();
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    await disconnectFromApi();
    return NextResponse.json(
      { error: "Failed to fetch data from MikroTik" },
      { status: 500 },
    );
  }
}

//Post PPPoE
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
    const mikrotikResult = await api.write(
      "/ppp/secret/set",
      [
        `=.id=${id}`,
        name ? `=name=${name}` : "",
        password ? `=password=${password}` : "",
        profile ? `=password=${profile}` : "",
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
    const mikrotikResult = await api.write("/ppp/secret/remove", [
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
