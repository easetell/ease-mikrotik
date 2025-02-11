import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import { RouterOSAPI } from "node-routeros"; // Import the RouterOSAPI library

// MikroTik API configuration
export const mikrotikApi = new RouterOSAPI({
  host: process.env.ROUTER_IP || "",
  user: process.env.USER_NAME,
  password: process.env.ROUTER_PASSWORD,
  port: process.env.API_PORT ? Number(process.env.API_PORT) : 8728, // Convert to number and provide a fallback
});

// GET route to fetch MikroTik system information (CPU, uptime, identity)
export async function GET() {
  try {
    // Connect to MikroTik
    await mikrotikApi.connect();

    // Fetch system resource information (CPU, uptime)
    const systemResourcesResponse = await mikrotikApi.write([
      "/system/resource/print",
    ]);
    // console.log("System Resources Response:", systemResourcesResponse); // Debugging

    if (!systemResourcesResponse || !systemResourcesResponse.length) {
      throw new Error("No system resources data found");
    }

    const systemResources = systemResourcesResponse[0]; // Extract the first resource entry

    // Fetch system identity information
    const systemIdentityResponse = await mikrotikApi.write([
      "/system/identity/print",
    ]);
    // console.log("System Identity Response:", systemIdentityResponse); // Debugging

    if (!systemIdentityResponse || !systemIdentityResponse.length) {
      throw new Error("No system identity data found");
    }

    const systemIdentity = systemIdentityResponse[0]; // Extract the first identity entry

    // Disconnect from MikroTik
    mikrotikApi.close();

    // Extract relevant data
    const cpuUsage = systemResources["cpu-load"];
    const uptime = systemResources.uptime;
    const identity = systemIdentity.name;

    // Return the data as JSON
    return NextResponse.json(
      {
        cpuUsage,
        uptime,
        identity,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to fetch MikroTik system information:", error);
    return NextResponse.json(
      { message: "Failed to fetch MikroTik system information" },
      { status: 500 },
    );
  }
}
