import { NextResponse } from "next/server";
import { RouterOSAPI } from "node-routeros";

export const mikrotikApi = new RouterOSAPI({
  host: process.env.ROUTER_IP || "",
  user: process.env.USER_NAME,
  password: process.env.ROUTER_PASSWORD,
  port: process.env.API_PORT ? Number(process.env.API_PORT) : 8728, // Convert to number and provide a fallback
});

export async function POST(request: Request) {
  try {
    const { clientName, expiryDate } = await request.json();

    // Validate input
    if (!clientName || !expiryDate) {
      return NextResponse.json(
        { success: false, message: "clientName and expiryDate are required" },
        { status: 400 },
      );
    }

    // Connect to MikroTik
    await mikrotikApi.connect();
    console.log("Connected to MikroTik API");

    // Update the comment field with the new expiryDate
    await mikrotikApi.write("/ppp/secret/set", [
      `=numbers=[find name=${clientName}]`,
      `=comment=${expiryDate}`,
    ]);
    console.log(`Updated expiryDate for ${clientName}`);

    // Check if the expiryDate has passed
    const currentDate = new Date();
    const expiry = new Date(expiryDate);

    if (expiry < currentDate) {
      // Disable the user if expiryDate has passed
      await mikrotikApi.write("/ppp/secret/set", [
        `=numbers=[find name=${clientName}]`,
        `=disabled=yes`,
      ]);
      console.log(`Disabled expired user: ${clientName}`);

      // Disconnect active session (if any)
      const activeUsers = await mikrotikApi.write("/ppp/active/print");
      const activeUser = activeUsers.find(
        (user: any) => user.name === clientName,
      );

      if (activeUser) {
        await mikrotikApi.write("/ppp/active/remove", [
          `=.id=${activeUser[".id"]}`,
        ]);
        console.log(`Disconnected active session for: ${clientName}`);
      } else {
        console.log(`No active session found for: ${clientName}`);
      }
    } else {
      // Enable the user if expiryDate is in the future
      await mikrotikApi.write("/ppp/secret/set", [
        `=numbers=[find name=${clientName}]`,
        `=disabled=no`,
      ]);
      console.log(`Enabled user: ${clientName}`);
    }

    // Disconnect from MikroTik
    await mikrotikApi.close();
    console.log("Closed MikroTik API connection");

    return NextResponse.json(
      { success: true, message: `Updated expiryDate for ${clientName}` },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to update MikroTik comment field:", error);

    // Ensure the connection is closed even if an error occurs
    try {
      await mikrotikApi.close();
    } catch (closeError) {
      console.error("Error closing MikroTik API connection:", closeError);
    }

    return NextResponse.json(
      { success: false, message: "Failed to update MikroTik comment field" },
      { status: 500 },
    );
  }
}
