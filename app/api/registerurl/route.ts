// app/api/registerurl/route.js
import { NextResponse } from "next/server";
import axios from "axios";
import getMpesaToken from "@/config/mpesaAuth";

export async function GET() {
  try {
    const accessToken = await getMpesaToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    const auth = "Bearer " + accessToken;

    const response = await axios.post(
      url,
      {
        ShortCode: process.env.MPESA_SHORTCODE,
        ResponseType: "Complete",
        ConfirmationURL: "https://ease-mikrotik.vercel.app/api/confirmation",
        ValidationURL: "https://ease-mikrotik.vercel.app/api/validation",
      },
      {
        headers: {
          Authorization: auth,
        },
      },
    );

    return NextResponse.json(response.data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "❌ Request failed" }, { status: 500 });
  }
}
