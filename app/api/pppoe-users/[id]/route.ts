import { NextRequest, NextResponse } from "next/server";
import { mikrotikApi } from "@/config/mikrotikApi";
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

// Get single PPPoE user
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

export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const {
    name,
    password,
    profile,
    "caller-id": callerId,
    firstName,
    lastName,
    phoneNumber,
    email,
    gender,
    expiryDate, // This could be a string or a Date object
    building,
    locationCod,
    idNumber,
  } = await req.json();

  const { id } = params;

  try {
    await connectDB();

    // Find the customer by MikroTik ID
    const mikcustomer = await MikCustomers.findOne({ mikrotikId: id });
    if (!mikcustomer) {
      return NextResponse.json(
        { message: "Mikcustomer not found" },
        { status: 404 },
      );
    }

    // Validate expiryDate
    let expiryDateObj: Date;
    if (typeof expiryDate === "string") {
      expiryDateObj = new Date(expiryDate); // Convert string to Date
    } else if (expiryDate instanceof Date) {
      expiryDateObj = expiryDate; // Use as-is if it's already a Date
    } else {
      return NextResponse.json(
        { message: "Invalid expiryDate format" },
        { status: 400 },
      );
    }

    // Ensure expiryDate is a valid Date
    if (isNaN(expiryDateObj.getTime())) {
      return NextResponse.json(
        { message: "Invalid expiryDate value" },
        { status: 400 },
      );
    }

    // ✅ Determine the new status based on expiry date
    const currentDate = new Date();
    const newStatus = expiryDateObj < currentDate ? "inactive" : "active";

    // ✅ Update the fields in the database
    mikcustomer.name = name || mikcustomer.name;
    mikcustomer.password = password || mikcustomer.password;
    mikcustomer.profile = profile || mikcustomer.profile;
    mikcustomer["caller-id"] = callerId || mikcustomer["caller-id"];
    mikcustomer.firstName = firstName || mikcustomer.firstName;
    mikcustomer.lastName = lastName || mikcustomer.lastName;
    mikcustomer.phoneNumber = phoneNumber || mikcustomer.phoneNumber;
    mikcustomer.email = email || mikcustomer.email;
    mikcustomer.gender = gender || mikcustomer.gender;
    mikcustomer.expiryDate = expiryDateObj; // Use the validated Date object
    mikcustomer.building = building || mikcustomer.building;
    mikcustomer.locationCod = locationCod || mikcustomer.locationCod;
    mikcustomer.idNumber = idNumber || mikcustomer.idNumber;
    mikcustomer.status = newStatus; // ✅ Set status based on expiry date

    // ✅ Set the comment field to the expiryDate
    mikcustomer.comment = expiryDateObj.toISOString(); // Update comment to expiryDate

    // ✅ Save the updated customer to the database
    await mikcustomer.save();

    // ✅ Update the comment field in MikroTik
    await connectToApi();
    await mikrotikApi.write("/ppp/secret/set", [
      `=.id=${id}`,
      `=comment=${mikcustomer.comment}`, // Update comment in MikroTik
    ]);
    await disconnectFromApi();

    return NextResponse.json(
      {
        message: "Mikcustomer updated successfully",
        mikcustomer,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ Failed to update Mikcustomer:", error);
    await disconnectFromApi();
    return NextResponse.json(
      { message: "Failed to update Mikcustomer" },
      { status: 500 },
    );
  }
}

// Delete PPPoE user
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
