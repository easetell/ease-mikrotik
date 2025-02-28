import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import connectDB from "@/config/db";
import { mikrotikApi } from "@/config/mikrotikApi";
import HotspotProfiles from "@/models/HotspotProfiles";

// Helper functions to connect and disconnect from MikroTik API
async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

// GET route to fetch all Hotspot profiles
export async function GET() {
  await connectDB();

  try {
    const hotspotProfiles = await HotspotProfiles.find({});
    return NextResponse.json({ hotspotProfiles }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Hotspot profiles:", error);
    return NextResponse.json(
      { message: "Failed to fetch Hotspot profiles" },
      { status: 500 },
    );
  }
}

// POST route to create a new Hotspot profile
export async function POST(req: NextRequest) {
  const {
    name,
    "address-pool": addressPool,
    "session-timeout": sessionTimeout,
    "shared-users": sharedUsers,
    "rate-limit": rateLimit,
    price,
    moduleType,
  } = await req.json();

  try {
    let mikrotikId = null;
    let syncRequired = false;

    try {
      await connectToApi();

      // Construct the command parameters for MikroTik
      const commandParams = [
        `=name=${name}`,
        `=address-pool=${addressPool}`,
        `=session-timeout=${sessionTimeout}`,
        `=shared-users=${sharedUsers}`,
        `=rate-limit=${rateLimit}`,
      ];

      // Execute the MikroTik API command with the correct path
      const mikrotikResult = await mikrotikApi.write(
        "/ip/hotspot/user/profile/add",
        commandParams,
      );

      // Ensure the response has the expected format
      if (
        mikrotikResult &&
        mikrotikResult.length > 0 &&
        mikrotikResult[0].ret
      ) {
        mikrotikId = mikrotikResult[0].ret; // Assuming 'ret' contains the ID
      } else {
        throw new Error("Invalid MikroTik API response");
      }
    } catch (mikrotikError) {
      console.error(
        "MikroTik connection failed, plan will be synchronized later:",
        mikrotikError,
      );
      syncRequired = true;
    } finally {
      await disconnectFromApi();
    }

    await connectDB();

    // Save the profile to the database
    const hotspotProfile = new HotspotProfiles({
      mikrotikId,
      name,
      "address-pool": addressPool,
      "session-timeout": sessionTimeout,
      "shared-users": sharedUsers,
      "rate-limit": rateLimit,
      price,
      moduleType,
      syncRequired,
    });

    await hotspotProfile.save();

    return NextResponse.json(
      {
        message: "Hotspot Profile created successfully",
        hotspotProfile: hotspotProfile,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create Hotspot profile:", error);
    return NextResponse.json(
      { message: "Failed to create Hotspot profile" },
      { status: 500 },
    );
  }
}
