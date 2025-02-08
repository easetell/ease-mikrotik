import axios from "axios";
import getMpesaToken from "./mpesaAuth";
import dotenv from "dotenv";

dotenv.config();

const MPESA_SHORTCODE = process.env.MPESA_SHORTCODE; // Your Paybill or Till number
const MPESA_PASSKEY = process.env.MPESA_PASSKEY; // Your M-Pesa Passkey

/**
 * Initiate STK Push payment request
 * @param Amount - Amount to be paid
 * @param MpesaReceiptNumber
 * @param AccountNumber
 * @param PhoneNumber - Client's phone number (format: 2547XXXXXXXX)
 */
const initiateSTKPush = async (
  PhoneNumber: string,
  Amount: number,
  AccountNumber: string,
  MpesaReceiptNumber: string,
) => {
  try {
    // Step 1: Get M-Pesa access token
    const token = await getMpesaToken();
    if (!token) {
      throw new Error("Failed to get M-Pesa access token.");
    }

    // Step 2: Generate timestamp and password
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3);
    const password = Buffer.from(
      `${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`,
    ).toString("base64");

    // Step 3: Prepare STK Push request payload
    const payload = {
      BusinessShortCode: MPESA_SHORTCODE,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: Amount,
      PartyA: PhoneNumber,
      PartyB: MPESA_SHORTCODE,
      PhoneNumber: PhoneNumber,
      CallBackURL: "https://ease-mikrotik.vercel.app/api/mpesa-call-back",
      AccountReference: AccountNumber,
      TransactionDesc: "Payment for internet service",
    };

    // Step 4: Send STK Push request
    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (response.data.ResponseCode === "0") {
      console.log("✅ STK Push initiated successfully:", response.data);
      return response.data;
    } else {
      throw new Error(
        `Failed to initiate STK Push: ${response.data.ResponseDescription}`,
      );
    }
  } catch (error: unknown) {
    console.error(
      "❌ Error initiating STK Push:",
      axios.isAxiosError(error)
        ? error.response?.data || error.message
        : error instanceof Error
          ? error.message
          : "Unknown error occurred",
    );
    throw error;
  }
};

export default initiateSTKPush;
