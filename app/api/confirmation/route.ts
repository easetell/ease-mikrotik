// app/api/confirmation/route.ts
import { NextResponse, NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("All transactions will be sent to this URL");
    console.log(body);

    return NextResponse.json({ message: "Confirmation received" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "❌ Failed to process confirmation" },
      { status: 500 },
    );
  }
}
