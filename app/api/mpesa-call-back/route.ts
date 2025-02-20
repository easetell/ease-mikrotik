import { NextResponse } from "next/server";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
import { reconnectClient } from "@/config/reconnectClient";

export async function POST(request: Request) {
  try {
    // Step 1: Parse the request body
    const payload = await request.json();
    console.log("Incoming payload:", JSON.stringify(payload, null, 2)); // Log the payload

    // Step 2: Verify payment success
    if (payload.Body?.stkCallback?.ResultCode !== "0") {
      throw new Error(
        `Payment failed: ${payload.Body?.stkCallback?.ResultDesc || "Unknown error"}`,
      );
    }

    // Step 3: Extract payment details
    const callbackMetadata = payload.Body.stkCallback.CallbackMetadata;
    if (!callbackMetadata || !callbackMetadata.Item) {
      throw new Error("Invalid CallbackMetadata structure");
    }

    const amountItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "Amount",
    );
    const mpesaReceiptNumberItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "MpesaReceiptNumber",
    );
    const phoneNumberItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "PhoneNumber",
    );
    const accountNumberItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "AccountNumber",
    );

    if (
      !amountItem ||
      !mpesaReceiptNumberItem ||
      !phoneNumberItem ||
      !accountNumberItem
    ) {
      throw new Error("Missing required fields in CallbackMetadata");
    }

    const amount = amountItem.Value;
    const mpesaReceiptNumber = mpesaReceiptNumberItem.Value;
    const phoneNumber = phoneNumberItem.Value;
    const accountNumber = accountNumberItem.Value;

    console.log("Extracted payment details:", {
      amount,
      mpesaReceiptNumber,
      phoneNumber,
      accountNumber,
    });

    // Step 4: Find the client by account number
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
