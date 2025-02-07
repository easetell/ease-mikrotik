import { NextResponse } from "next/server";
import MikCustomers from "@/models/MikCustomers";
import BillingPlans from "@/models/BillingPlans";
import { reconnectClient } from "@/config/reconnectClient";

export async function POST(request: Request) {
  try {
    // Step 1: Parse the request body
    const payload = await request.json();
    console.log("Incoming payload:", JSON.stringify(payload, null, 2)); // Log the payload

    let amount: number;
    let phoneNumber: string;
    let accountNumber: string;

    // Step 2: Determine the payload type and extract payment details
    if (payload.Body?.stkCallback) {
      // STK Push Callback Payload
      const callbackMetadata = payload.Body.stkCallback.CallbackMetadata;
      if (!callbackMetadata || !callbackMetadata.Item) {
        throw new Error("Invalid STK Push CallbackMetadata structure");
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
        throw new Error("Missing required fields in STK Push CallbackMetadata");
      }

      amount = amountItem.Value;
      phoneNumber = phoneNumberItem.Value;
      accountNumber = accountNumberItem.Value;
    } else if (payload.TransactionType === "Pay Bill") {
      // C2B Validation/Confirmation Payload
      amount = parseFloat(payload.TransAmount);
      phoneNumber = payload.MSISDN;
      accountNumber = payload.BillRefNumber;
    } else {
      throw new Error("Unsupported payload type");
    }

    console.log("Extracted payment details:", {
      amount,
      phoneNumber,
      accountNumber,
    });

    // Step 3: Find the client by account number (name)
    const client = await MikCustomers.findOne({ name: accountNumber });
    if (!client) {
      throw new Error(`Client with account number ${accountNumber} not found.`);
    }

    // Step 4: Find the plan by profile name
    const plan = await BillingPlans.findOne({ name: client.profile });
    if (!plan) {
      throw new Error(`Plan ${client.profile} not found.`);
    }

    // Step 5: Verify payment amount
    if (amount < plan.price) {
      throw new Error(
        `Insufficient payment. Expected ${plan.price}, received ${amount}`,
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
