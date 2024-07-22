// app/api/billing-plans/route.ts
import { NextRequest, NextResponse } from "next/server";
import "source-map-support/register";
import connectDB from "@/config/db";
import mikrotikApi from "@/config/mikrotikApi";
import BillingPlans, { IBillingPlan } from "@/models/BillingPlans";

// Helper functions to connect and disconnect from MikroTik API
async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

// GET route to fetch all billing plans
export async function GET() {
  await connectDB();

  try {
    const billingPlans = await BillingPlans.find({});
    return NextResponse.json({ billingPlans }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch billing plans:", error);
    return NextResponse.json(
      { message: "Failed to fetch billing plans" },
      { status: 500 },
    );
  }
}

// POST route to create a new billing plan
export async function POST(req: NextRequest) {
  const {
    "local-address": localAddress,
    name,
    "rate-limit": rateLimit,
    "remote-address": remoteAddress,
    price,
    duration,
    moduleType,
  } = await req.json();

  try {
    await connectToApi();
    const mikrotikResult = await mikrotikApi.write("/ppp/profile/add", [
      `=local-address=${localAddress}`,
      `=name=${name}`,
      `=rate-limit=${rateLimit}`,
      `=remote-address=${remoteAddress}`,
    ]);
    await disconnectFromApi();

    // Ensure the response has the expected format
    if (mikrotikResult && mikrotikResult.length > 0 && mikrotikResult[0].ret) {
      const mikrotikId = mikrotikResult[0].ret; // Assuming 'ret' contains the ID

      await connectDB();

      const billingPlan = new BillingPlans({
        mikrotikId,
        "local-address": localAddress,
        name,
        "rate-limit": rateLimit,
        "remote-address": remoteAddress,
        price,
        duration,
        moduleType,
      });

      await billingPlan.save();

      return NextResponse.json(
        {
          message: "Billing Plan created successfully",
          billingPlan: billingPlan,
        },
        { status: 201 },
      );
    } else {
      throw new Error("Invalid MikroTik API response");
    }
  } catch (error) {
    console.error("Failed to create billing plan:", error);
    return NextResponse.json(
      { message: "Failed to create billing plan" },
      { status: 500 },
    );
  }
}
