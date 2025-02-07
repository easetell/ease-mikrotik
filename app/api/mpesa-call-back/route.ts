import { NextResponse } from "next/server";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
import { reconnectClient } from "@/config/reconnectClient";

export async function POST(request: Request) {
  try {
    // Step 1: Log the entire request
    const headers = Object.fromEntries(request.headers.entries());
    const body = await request.json();
    console.log("Incoming request headers:", JSON.stringify(headers, null, 2));
    console.log("Incoming request body:", JSON.stringify(body, null, 2));

    // Step 2: Verify payment success
    if (body.Body?.stkCallback?.ResultCode !== "0") {
      throw new Error(
        `Payment failed: ${body.Body?.stkCallback?.ResultDesc || "Unknown error"}`,
      );
    }

    // Step 3: Extract payment details
    const callbackMetadata = body.Body.stkCallback.CallbackMetadata;
    if (!callbackMetadata || !callbackMetadata.Item) {
      throw new Error("Invalid CallbackMetadata structure");
    }

    const amountItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "Amount",
    );
    const phoneNumberItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "PhoneNumber",
    );
    const accountNumberItem = callbackMetadata.Item.find(
      (item: any) => item.Name === "AccountNumber",
    );

    if (!amountItem || !phoneNumberItem || !accountNumberItem) {
      throw new Error("Missing required fields in CallbackMetadata");
    }

    const amount = amountItem.Value;
    const phoneNumber = phoneNumberItem.Value;
    const accountNumber = accountNumberItem.Value;

    console.log("Extracted payment details:", {
      amount,
      phoneNumber,
      accountNumber,
    });

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
