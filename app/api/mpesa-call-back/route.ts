import { NextResponse } from "next/server";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
import { reconnectClient } from "@/config/reconnectClient";
// import { sendSMS } from "@/lib/sms";

export async function POST(request: Request) {
  try {
    // Step 1: Parse the request body
    const callbackData = await request.json();

    // Step 2: Verify payment success
    if (callbackData.Body.stkCallback.ResultCode !== "0") {
      throw new Error(
        `Payment failed: ${callbackData.Body.stkCallback.ResultDesc}`,
      );
    }

    // Step 3: Extract payment details
    const amount = callbackData.Body.stkCallback.CallbackMetadata.Item[0].Value;
    const mpesaReceiptNumber =
      callbackData.Body.stkCallback.CallbackMetadata.Item[1].Value;
    const phoneNumber =
      callbackData.Body.stkCallback.CallbackMetadata.Item[3].Value;
    const accountNumber =
      callbackData.Body.stkCallback.CallbackMetadata.Item[4].Value;

    // Step 4: Find the client by account number (name)
    const client = await MikCustomers.findOne({ name: accountNumber });
    if (!client) {
      throw new Error(`Client with account number ${accountNumber} not found.`);
    }

    // Step 5: Find the plan by profile name
    const plan = await BillingPlans.findOne({ name: client.profile });
    if (!plan) {
      throw new Error(`Plan ${client.profile} not found.`);
    }

    // Step 6: Verify payment amount
    if (amount < plan.price) {
      throw new Error(
        `Insufficient payment. Expected ${plan.price}, received ${amount}`,
      );
    }

    // Step 7: Update client status and expiry date
    client.status = "active";
    client.expiryDate = new Date(
      new Date().setDate(new Date().getDate() + plan.duration),
    );
    await client.save();

    // Step 8: Reconnect client on MikroTik
    await reconnectClient(client.name);

    // Step 9: Notify client
    // await sendSMS(
    //   client.phoneNumber,
    //   `Dear ${client.name}, your payment of ${amount} has been received. Your internet service has been reconnected.`,
    // );

    console.log(`✅ Payment processed successfully for ${client.name}`);
    return NextResponse.json(
      { success: true, message: "Payment processed successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    console.error("❌ Error processing payment callback:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 400 },
    );
  }
}
