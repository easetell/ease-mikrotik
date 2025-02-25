import { NextRequest, NextResponse } from "next/server";
import { mikrotikApi } from "@/config/mikrotikApi";
import "source-map-support/register";
import connectDB from "@/config/db";
import HotspotProfiles from "@/models/HotspotProfiles";

// Type for the request parameters
interface Params {
  id: string;
}

// Helper functions to connect and disconnect from MikroTik API
async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

// GET: Fetch a single Hotspot profile by ID
export async function GET(request: NextRequest, { params }: { params: Params }) {
  await connectDB();

  const { id } = params;

  try {
    const hotspotProfile = await HotspotProfiles.findOne({ mikrotikId: id });
    if (!hotspotProfile) {
      return NextResponse.json(
        { message: "Hotspot Profile not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ hotspotProfile }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Hotspot Profile:", error);
    return NextResponse.json(
      { message: "Failed to fetch Hotspot Profile" },
      { status: 500 }
    );
  }
}

// PUT: Update a single Hotspot profile
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const {
    name,
    "address-pool": addressPool,
    "session-timeout": sessionTimeout,
    "shared-users": sharedUsers,
    "rate-limit": rateLimit,
    price,
    moduleType,
  } = await req.json();

  const { id } = params;

  try {
    await connectToApi();

    // Construct the command parameters for MikroTik
    const commandParams = [
      `=.id=${id}`,
      name ? `=name=${name}` : "",
      addressPool ? `=address-pool=${addressPool}` : "",
      sessionTimeout ? `=session-timeout=${sessionTimeout}` : "",
      sharedUsers ? `=shared-users=${sharedUsers}` : "",
      rateLimit ? `=rate-limit=${rateLimit}` : "",
    ].filter(Boolean); // Remove empty strings

    // Execute the MikroTik API command to update the profile
    const mikrotikResult = await mikrotikApi.write(
      "/ip/hotspot/user/profile/set",
      commandParams
    );

    await disconnectFromApi();

    // Log the MikroTik API response for debugging
    console.log("MikroTik API Response:", mikrotikResult);

    // Update the profile in the database
    await connectDB();
    const hotspotProfile = await HotspotProfiles.findOneAndUpdate(
      { mikrotikId: id },
      {
        name,
        "address-pool": addressPool,
        "session-timeout": sessionTimeout,
        "shared-users": sharedUsers,
        "rate-limit": rateLimit,
        price,
        moduleType,
      },
      { new: true } // Return the updated document
    );

    if (!hotspotProfile) {
      return NextResponse.json(
        { message: "Hotspot Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Hotspot Profile updated successfully", hotspotProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update Hotspot Profile:", error);
    await disconnectFromApi();
    return NextResponse.json(
      { message: "Failed to update Hotspot Profile" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a single Hotspot profile
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    await connectToApi();

    // Execute the MikroTik API command to delete the profile
    await mikrotikApi.write("/ip/hotspot/user/profile/remove", [`=.id=${id}`]);

    await disconnectFromApi();

    // Delete the profile from the database
    await connectDB();
    const hotspotProfile = await HotspotProfiles.findOneAndDelete({ mikrotikId: id });

    if (!hotspotProfile) {
      return NextResponse.json(
        { message: "Hotspot Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Hotspot Profile deleted successfully", hotspotProfile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to delete Hotspot Profile:", error);
    await disconnectFromApi();
    return NextResponse.json(
      { message: "Failed to delete Hotspot Profile" },
      { status: 500 }
    );
  }
}