import Transaction from "@/models/Transaction";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
import { reconnectClient } from "@/config/reconnectClient";

async function processPendingTransactions() {
  try {
    console.log("Checking for pending transactions...");

    // Step 1: Find all pending transactions
    const pendingTransactions = await Transaction.find({ status: "pending" });

    if (pendingTransactions.length === 0) {
      console.log("No pending transactions found.");
      return;
    }

    // Step 2: Process each transaction
    for (const transaction of pendingTransactions) {
      try {
        console.log(`Processing transaction: ${transaction.transactionId}`);

        // Step 3: Find the client by account number
        const client = await MikCustomers.findOne({
          name: transaction.accountNumber,
        });
        if (!client) {
          throw new Error(
            `Client with account number ${transaction.accountNumber} not found.`,
          );
        }

        // Step 4: Find the plan by profile name
        const plan = await BillingPlans.findOne({ name: client.profile });
        if (!plan) {
          throw new Error(`Plan ${client.profile} not found.`);
        }

        // Step 5: Verify payment amount
        if (transaction.amount < plan.price) {
          throw new Error(
            `Insufficient payment. Expected ${plan.price}, received ${transaction.amount}`,
          );
        }

        // Step 6: Update client status and expiry date
        client.status = "active";
        client.expiryDate = new Date(
          new Date().setDate(new Date().getDate() + plan.duration),
        );
        await client.save();

        // Step 7: Reconnect client on MikroTik
        await reconnectClient(client.name);

        // Step 8: Mark transaction as processed
        transaction.status = "processed";
        await transaction.save();

        console.log(`✅ Transaction processed: ${transaction.transactionId}`);
      } catch (error) {
        console.error(
          `❌ Error processing transaction ${transaction.transactionId}:`,
          error,
        );
      }
    }
  } catch (error) {
    console.error("❌ Error checking for pending transactions:", error);
  }
}

// Run the function every 10 seconds
setInterval(processPendingTransactions, 10 * 1000);

export default processPendingTransactions;
