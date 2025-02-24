import { NextResponse } from "next/server";
import axios from "axios";
import moment from "moment";
import { getMpesaToken } from "@/config/mpesaAuth";

export async function POST(req: Request) {
  try {
    const { phone, amount, accountNumber } = await req.json();
    let phoneNumber = phone.startsWith("0") ? "254" + phone.slice(1) : phone;

    const accessToken = await getMpesaToken();
    const timestamp = moment().format("YYYYMMDDHHmmss");
    const password = Buffer.from(
      `${process.env.HOTSPOT_SHOT_CODE}${process.env.MPESA_PASSKEY}${timestamp}`,
    ).toString("base64");

    const stkPushPayload = {
      BusinessShortCode: process.env.HOTSPOT_SHOT_CODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: process.env.HOTSPOT_SHOT_CODE,
      PhoneNumber: phoneNumber,
      CallBackURL: "https://ease-mikrotik.vercel.app/api/callback", // Ensure this is correct
      AccountReference: accountNumber,
      TransactionDesc: "Hotspot Internet Purchase",
    };

    console.log(
      "📩 STK Push Payload:",
      JSON.stringify(stkPushPayload, null, 2),
    );

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushPayload,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    console.log(
      "✅ STK Push Response:",
      JSON.stringify(response.data, null, 2),
    );

    return NextResponse.json(
      {
        success: true,
        message: "STK Push sent. Enter PIN to complete payment.",
        checkoutRequestID: response.data.CheckoutRequestID, // Return the CheckoutRequestID
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ STK Push Error:", error);
    return NextResponse.json(
      { success: false, message: "STK Push request failed." },
      { status: 500 },
    );
  }
}
