import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("📩 Incoming STK Callback:", JSON.stringify(payload, null, 2));

    return NextResponse.json(
      {
        success: true,
        message: "Callback received and logged.",
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Callback Error:", error.message || error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Error processing callback.",
      },
      { status: 400 },
    );
  }
}
