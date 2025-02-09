import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("Validating payment");
    console.log(body);

    return NextResponse.json({ message: "Validation received" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "❌ Failed to process validation" },
      { status: 500 },
    );
  }
}
