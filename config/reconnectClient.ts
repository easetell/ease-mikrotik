import { mikrotikApi } from "./mikrotikApi";
import MikCustomers from "@/models/MikCustomers";

/**
 * Reconnect a PPPoE client on MikroTik
 * @param name - The PPPoE username of the client
 */
export const reconnectClient = async (name: string) => {
  let mikrotikConnected = false;

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
    mikrotikConnected = true;
    console.log("Connected to MikroTik API");

    // Step 3: Validate that the profile exists on MikroTik
    const profiles = await mikrotikApi.write("/ppp/profile/print");
    const profileExists = profiles.some(
      (profile: any) => profile.name === clientProfile,
    );
    if (!profileExists) {
      throw new Error(`Profile ${clientProfile} not found on MikroTik.`);
    }

    // Step 4: Update the client's profile on MikroTik
    await mikrotikApi.write("/ppp/secret/set", [
      `=numbers=${name}`,
      `=profile=${clientProfile}`, // Set the profile to the one from the database
    ]);
    console.log(`Updated profile for ${name} to ${clientProfile}`);

    // Step 5: Find and remove the active session (if online)
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

    console.log(`✅ Successfully reconnected client: ${name}`);
  } catch (error) {
    console.error(`❌ Error reconnecting client ${name}:`, error);
    throw error;
  } finally {
    // Step 6: Close the MikroTik connection
    if (mikrotikConnected) {
      await mikrotikApi.close();
      console.log("Closed MikroTik API connection");
    }
  }
};
