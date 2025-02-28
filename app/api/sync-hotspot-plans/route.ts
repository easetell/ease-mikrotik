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

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Find all plans that need synchronization
    const unsyncedPlans = await HotspotProfiles.find({ syncRequired: true });

    if (unsyncedPlans.length === 0) {
      return NextResponse.json(
        { message: "No plans to synchronize" },
        { status: 200 },
      );
    }

    await connectToApi();

    for (const plan of unsyncedPlans) {
      try {
        const commandParams = [
          `=name=${plan.name}`,
          `=address-pool=${plan["address-pool"]}`,
          `=session-timeout=${plan["session-timeout"]}`,
          `=shared-users=${plan["shared-users"]}`,
          `=rate-limit=${plan["rate-limit"]}`,
        ];

        const mikrotikResult = await mikrotikApi.write(
          "/ip/hotspot/user/profile/add",
          commandParams,
        );

        if (
          mikrotikResult &&
          mikrotikResult.length > 0 &&
          mikrotikResult[0].ret
        ) {
          plan.mikrotikId = mikrotikResult[0].ret;
          plan.syncRequired = false;
          await plan.save();
        }
      } catch (error) {
        console.error(`Failed to synchronize plan ${plan.name}:`, error);
      }
    }

    await disconnectFromApi();

    return NextResponse.json(
      { message: "Synchronization completed", unsyncedPlans },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to synchronize plans:", error);
    return NextResponse.json(
      { message: "Failed to synchronize plans" },
      { status: 500 },
    );
  }
}
