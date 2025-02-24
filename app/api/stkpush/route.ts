import { NextResponse } from "next/server";
import axios from "axios";
import moment from "moment";
import { getMpesaToken } from "@/config/mpesaAuth";
import Voucher from "@/models/voucherSchema";
import { mikrotikApi } from "@/config/mikrotikApi";
import HotspotTransactions from "@/models/HotspotTransactions";
import generateVoucher from "@/utils/voucherGenerator"; // Ensure correct import
import connectDB from "@/config/db";

export async function POST(req: Request) {
  try {
    await connectDB(); // Ensure database connection
    console.log("✅ Connected to MongoDB");

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
      CallBackURL: "https://ease-mikrotik.vercel.app/api/callback", // Optional: Keep for logging
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

    const { MerchantRequestID, CheckoutRequestID } = response.data;

    // Generate voucher (name)
    let voucherCode;
    let isVoucherUnique = false;
    while (!isVoucherUnique) {
      voucherCode = generateVoucher();
      console.log("Generated Voucher Code:", voucherCode);

      // Check if the voucher code already exists
      const existingVoucher = await Voucher.findOne({ name: voucherCode });
      if (!existingVoucher) {
        isVoucherUnique = true;
      }
    }

    // Store transaction in MongoDB
    try {
      await HotspotTransactions.create({
        phoneNumber,
        accountNumber,
        amount,
        mpesaReceiptNumber: voucherCode, // Will be updated later
        voucherCode,
        checkoutRequestID: CheckoutRequestID,
        status: "Pending", // Set to "Pending" initially
      });
      console.log("✅ Transaction stored in MongoDB");
    } catch (error) {
      console.error("❌ Error storing transaction in MongoDB:", error);
      throw error;
    }

    // Store voucher in MongoDB
    try {
      // Get the current date in East African Time (EAT)
      const localDate = new Date();
      const offset = localDate.getTimezoneOffset() * 60000; // Convert offset to milliseconds
      const eastAfricanTime = new Date(localDate.getTime() + 3 * 3600000); // Add 3 hours for EAT (UTC+3)
      const localISOTime = eastAfricanTime.toISOString(); // Convert to ISO string

      await Voucher.create({
        name: voucherCode,
        password: "EASETELL",
        profile: accountNumber, // Set profile field to accountNumber
        phoneNumber,
        checkoutRequestID: CheckoutRequestID,
        status: "Unused",
        createdAt: localISOTime, // Store local time in the database
      });
      console.log("✅ Voucher stored in MongoDB");
    } catch (error) {
      console.error("❌ Error storing voucher in MongoDB:", error);
      throw error;
    }

    // Add the user to MikroTik Hotspot
    await mikrotikApi.connect();

    // Format the local date and time for East African Time (EAT)
    const localDate = new Date();
    const formattedDate = localDate.toLocaleString("en-US", {
      timeZone: "Africa/Nairobi", // Use East African Time (EAT)
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // Use 12-hour format (AM/PM)
    });

    const mikrotikResult = await mikrotikApi.write("/ip/hotspot/user/add", [
      `=server=lamutell`, // Server
      `=name=${voucherCode}`, // Fixed username for all clients
      `=password=EASETELL`, // Unique password per voucher
      `=profile=default`, // Adjust profile as needed
      `=limit-uptime=1h`, // Fixed 1-hour limit
      `=comment=${formattedDate}`, // Store the formatted local date and time
    ]);

    console.log("✅ Voucher added to MikroTik:", mikrotikResult);

    await mikrotikApi.close();

    console.log(`✅ Voucher Generated: ${voucherCode} for ${phoneNumber}`);

    return NextResponse.json(
      {
        success: true,
        message: "STK Push sent. Enter PIN to complete payment.",
        checkoutRequestID: CheckoutRequestID,
        voucher: voucherCode,
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
