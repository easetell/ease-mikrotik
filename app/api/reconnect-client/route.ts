import { NextResponse } from "next/server";
import processPendingTransactions from "@/config/processPendingTransactions";

export async function GET() {
  try {
    console.log("Running scheduled client check...");
    await processPendingTransactions();
    return NextResponse.json(
      { success: true, message: "Check complete" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Failed to check and disconnect expired clients:", error);
    return NextResponse.json(
      { message: "Failed to check and disconnect expired clients" },
      { status: 500 },
    );
  }
}
