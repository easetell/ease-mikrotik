// app/api/registerurl/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getMpesaToken } from "@/config/mpesaAuth";

export async function GET() {
  try {
    const accessToken = await getMpesaToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl"; // C2B v1 endpoint
    const auth = "Bearer " + accessToken;

    const payload = {
      ShortCode: process.env.MPESA_SHORT_CODE, // Your C2B shortcode
      ResponseType: "Completed", // Must be "Completed"
      ConfirmationURL: "https://ease-mikrotik.vercel.app/api/confirmation/", // Must be HTTPS
      ValidationURL: "https://ease-mikrotik.vercel.app/api/validation/", // Must be HTTPS
    };

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: auth,
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("❌ Error:", error);
    return NextResponse.json(
      { message: "❌ Request failed", error: error },
      { status: 500 },
    );
  }
}
