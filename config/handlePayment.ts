import { reconnectClient } from "./reconnectClient";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
// import { sendSMS } from "@/lib/sms";

async function handlePayment(clientName: string, amount: number) {
  try {
    // Step 1: Find the client
    const client = await MikCustomers.findOne({ name: clientName });
    if (!client) {
      throw new Error(`Client ${clientName} not found.`);
    }

    // Step 2: Find the plan
    const plan = await BillingPlans.findOne({ name: client.profile });
    if (!plan) {
      throw new Error(`Plan ${client.profile} not found.`);
    }

    // Step 3: Verify payment amount
    if (amount < plan.price) {
      throw new Error(
        `Insufficient payment. Expected ${plan.price}, received ${amount}`,
      );
    }

    // Step 4: Update client status and expiry date
    client.status = "active";
    client.expiryDate = new Date(
      new Date().setDate(new Date().getDate() + plan.duration),
    );
    await client.save();

    // Step 5: Reconnect client on MikroTik
    await reconnectClient(client.name);

    // Step 6: Notify client
    // await sendSMS(
    //   client.phoneNumber,
    //   `Dear ${client.name}, your payment of ${amount} has been received. Your internet service has been reconnected.`,
    // );

    console.log(`✅ Payment processed successfully for ${client.name}`);
  } catch (error) {
    console.error(`❌ Error processing payment for ${clientName}:`, error);
    throw error;
  }
}
