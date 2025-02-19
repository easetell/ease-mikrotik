import { mikrotikApi } from "./mikrotikApi";
import MikCustomers from "@/models/MikCustomers";

/**
 * Reconnect a PPPoE client on MikroTik
 * @param name - The PPPoE username of the client (string)
 */
export const reconnectClient = async (name: string): Promise<void> => {
  let mikrotikConnected: boolean = false;

  try {
    console.log(`Attempting to reconnect PPPoE user: ${name}`);

    // Step 1: Fetch the client's profile from the database
    const client = await MikCustomers.findOne({ name });
    if (!client) {
      throw new Error(`Client ${name} not found in the database.`);
    }

    // Step 2: Update the client's expiryDate to the next month's same date
    if (client.lastPayment && client.lastPayment.date) {
      const lastPaymentDate = new Date(client.lastPayment.date);
      const expiryDate = new Date(lastPaymentDate);

      // Set the expiryDate to the next month's same date
      expiryDate.setMonth(expiryDate.getMonth() + 1);

      // Update the expiryDate and comment fields in the database
      client.expiryDate = expiryDate;
      client.comment = expiryDate.toISOString(); // Update comment to expiryDate
      await client.save();
      console.log(
        `Updated expiryDate for ${name} to ${expiryDate.toISOString()}`,
      );
    } else {
      throw new Error(`No lastPayment date found for client ${name}.`);
    }

    // Step 3: Connect to MikroTik
    await mikrotikApi.connect();
    mikrotikConnected = true;
    console.log("Connected to MikroTik API");

    // Step 4: Update the comment field in MikroTik
    await mikrotikApi.write("/ppp/secret/set", [
      `=numbers=[find name=${name}]`,
      `=comment=${client.comment}`, // Update comment in MikroTik
    ]);
    console.log(`Updated comment for ${name} to ${client.comment}`);

    console.log(`✅ Successfully reconnected client: ${name}`);
  } catch (error) {
    console.error(`❌ Error reconnecting client ${name}:`, error);
    throw error;
  } finally {
    // Step 5: Close the MikroTik connection
    if (mikrotikConnected) {
      await mikrotikApi.close();
      console.log("Closed MikroTik API connection");
    }
  }
};
