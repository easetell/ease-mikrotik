// config/mpesaAuth.ts
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const MPESA_CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const MPESA_CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;

export const getMpesaToken = async (): Promise<string | null> => {
  try {
    if (!MPESA_CONSUMER_KEY || !MPESA_CONSUMER_SECRET) {
      throw new Error(
        "❌ Missing M-Pesa Consumer Key or Secret in environment variables.",
      );
    }

    const auth = Buffer.from(
      `${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`,
    ).toString("base64");

    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate",
      {
        params: { grant_type: "client_credentials" },
        headers: { Authorization: `Basic ${auth}` },
      },
    );

    if (!response.data || !response.data.access_token) {
      throw new Error(
        "❌ Invalid response from M-Pesa API. Access token missing.",
      );
    }

    console.log("✅ M-Pesa Access Token:", response.data.access_token);
    return response.data.access_token;
  } catch (error: unknown) {
    console.error(
      "❌ Failed to get M-Pesa token:",
      axios.isAxiosError(error)
        ? error.response?.data || error.message
        : error instanceof Error
          ? error.message
          : "Unknown error occurred",
    );
    return null;
  }
};
