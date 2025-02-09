import { NextResponse } from "next/server";
import { getMpesaToken } from "@/config/mpesaAuth";
import axios from "axios";

export async function GET() {
  try {
    const token = await getMpesaToken();
    if (!token) {
      throw new Error("Failed to retrieve token from M-Pesa API");
    }

    return NextResponse.json({ success: true, token });
  } catch (error: unknown) {
    let errorMessage =
      "An unknown error occurred while retrieving the M-Pesa token.";

    if (axios.isAxiosError(error)) {
      errorMessage =
        error.response?.data?.errorMessage || "M-Pesa API request failed.";
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error("❌ M-Pesa Token Error:", errorMessage);

    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 },
    );
  }
}
