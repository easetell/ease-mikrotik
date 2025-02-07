import { mikrotikApi } from "./mikrotikApi";
import MikCustomers from "@/models/MikCustomers";

/**
 * Reconnect a PPPoE client on MikroTik
 * @param name - The PPPoE username of the client
 */
export const reconnectClient = async (name: string) => {
  try {
    console.log(`Attempting to reconnect PPPoE user: ${name}`);

    // Step 1: Fetch the client's profile from the database
    const client = await MikCustomers.findOne({ name });
    if (!client) {
      throw new Error(`Client ${name} not found in the database.`);
    }

    const clientProfile = client.profile; // Profile stored in the database
    console.log(`Client profile from database: ${clientProfile}`);

    // Step 2: Connect to MikroTik
    await mikrotikApi.connect();
    console.log("Connected to MikroTik API");

    // Step 3: Update the client's profile on MikroTik
    await mikrotikApi.write("/ppp/secret/set", [
      `=numbers=${name}`,
      `=profile=${clientProfile}`, // Set the profile to the one from the database
    ]);
    console.log(`Updated profile for ${name} to ${clientProfile}`);

    // Step 4: Find and remove the active session (if online)
    const activeUsers = await mikrotikApi.write("/ppp/active/print");
    const activeUser = activeUsers.find((user: any) => user.name === name);

    if (activeUser) {
      await mikrotikApi.write("/ppp/active/remove", [
        `=.id=${activeUser[".id"]}`,
      ]);
      console.log(`Disconnected active session for: ${name}`);
    } else {
      console.log(`No active session found for: ${name}`);
    }

    // Step 5: Close the MikroTik connection
    await mikrotikApi.close();
    console.log("Closed MikroTik API connection");

    console.log(`✅ Successfully reconnected client: ${name}`);
  } catch (error) {
    console.error(`❌ Error reconnecting client ${name}:`, error);
    throw error;
  }
};
