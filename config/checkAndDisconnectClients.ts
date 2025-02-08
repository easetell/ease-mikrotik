import MikCustomers from "@/models/MikCustomers";
import { disconnectClient } from "./disconnectClient";

async function checkAndDisconnectClients() {
  try {
    console.log("Checking for expired users...");

    // Find clients whose expiry date has passed and are still active
    const clients = await MikCustomers.find({
      expiryDate: { $lt: new Date() },
      status: "active", // Only disconnect active clients
    });

    if (clients.length === 0) {
      console.log("No expired users found.");
      return;
    }

    for (const client of clients) {
      try {
        console.log(`Processing client: ${client.name}`);

        // Disconnect the client on MikroTik
        await disconnectClient(client.name);

        // Update the client's status to "inactive" in the database
        client.status = "inactive";
        await client.save();

        console.log(
          `Successfully disconnected and updated status for: ${client.name}`,
        );
      } catch (error) {
        console.error(`Error processing ${client.name}:`, error);
      }
    }

    console.log("Client disconnection process completed.");
  } catch (error) {
    console.error("Error checking for expired users:", error);
  }
}

export default checkAndDisconnectClients;
