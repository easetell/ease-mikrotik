import MikCustomers from "@/models/MikCustomers";
import { disconnectClient } from "./disconnectClient";

async function checkAndDisconnectClients() {
  try {
    console.log("Checking for expired users...");

    const clients = await MikCustomers.find({
      expiryDate: { $lt: new Date() },
    });

    if (clients.length === 0) {
      console.log("No expired users found.");
      return;
    }

    for (const client of clients) {
      try {
        console.log(`Processing client: ${client.name}`);

        await disconnectClient(client.name);
        await client.save();

        console.log(`Successfully disconnected: ${client.name}`);
      } catch (error) {
        console.error(`Error processing ${client.name}:`, error);
      }
    }

    console.log("Client disconnection process completed.");
  } catch (error) {
    console.error("Error checking for expired users:", error);
  }
}

// Run the function every minute
setInterval(checkAndDisconnectClients, 60 * 1000); // 60000 ms = 1 minute

export default checkAndDisconnectClients;
