// app/api/registerurl/route.ts
import { NextResponse } from "next/server";
import axios from "axios";
import { getMpesaToken } from "@/config/mpesaAuth";

export async function GET() {
  try {
    const accessToken = await getMpesaToken();
    const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v2/register"; // Updated endpoint for C2B v2
    const auth = "Bearer " + accessToken;

    const response = await axios.post(
      url,
      {
        ShortCode: process.env.MPESA_SHORTCODE, // Your C2B shortcode
        ResponseType: "Completed", // Note: "Completed" instead of "Complete"
        ConfirmationURL: "https://ease-mikrotik.vercel.app/api/confirmation", // Your confirmation URL
        ValidationURL: "https://ease-mikrotik.vercel.app/api/validation", // Your validation URL
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
