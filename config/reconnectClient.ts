import { mikrotikApi } from "./mikrotikApi";
import MikCustomers from "@/models/MikCustomers";

/**
 * Reconnect a PPPoE client on MikroTik
 * @param name - The PPPoE username of the client (string)
 */
export const reconnectClient = async (name: string): Promise<void> => {
  let mikrotikConnected: boolean = false;

  try {
    console.log(`🔹 Attempting to reconnect PPPoE user: ${name}`);

    // Step 1: Fetch the client's profile from the database
    const client = await MikCustomers.findOne({ name });
    if (!client) {
      throw new Error(`❌ Client ${name} not found in the database.`);
    }

    // Step 2: Update the client's expiryDate to the next month's same date
    if (client.lastPayment && client.lastPayment.date) {
      const lastPaymentDate = new Date(client.lastPayment.date);
      const expiryDate = new Date(lastPaymentDate);

      // Set expiry date to the next month's same date
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      // Update expiryDate & comment in the database
      client.expiryDate = expiryDate;
      client.comment = expiryDate.toISOString(); // Update comment field
      await client.save();
      console.log(
        `✅ Updated expiryDate for ${name} to ${expiryDate.toISOString()}`,
      );
    } else {
      throw new Error(`❌ No lastPayment date found for client ${name}.`);
    }

    // Step 3: Connect to MikroTik
    await mikrotikApi.connect();
    mikrotikConnected = true;
    console.log("✅ Connected to MikroTik API");

    // Step 4: Find the user in MikroTik
    const userData = await mikrotikApi.write("/ppp/secret/print", [
      `?name=${name}`,
    ]);

    if (!userData || userData.length === 0) {
      throw new Error(`❌ MikroTik user ${name} not found.`);
    }

    const userId = userData[0][".id"]; // Get MikroTik internal ID
    console.log(`🔹 Found MikroTik User ID: ${userId} for ${name}`);

    // Step 5: Update the comment field in MikroTik
    console.log(
      `🔹 Updating MikroTik comment for ${name} to: ${client.comment}`,
    );
    await mikrotikApi.write("/ppp/secret/set", [
      `=.id=${userId}`,
      `=comment=${client.comment}`,
    ]);

    console.log(`✅ MikroTik comment updated for ${name}: ${client.comment}`);

    console.log(`✅ Successfully reconnected client: ${name}`);
  } catch (error) {
    console.error(`❌ Error reconnecting client ${name}:`, error);
    throw error;
  } finally {
    // Step 6: Close MikroTik connection
    if (mikrotikConnected) {
      await mikrotikApi.close();
      console.log("✅ Closed MikroTik API connection");
    }
  }
};
