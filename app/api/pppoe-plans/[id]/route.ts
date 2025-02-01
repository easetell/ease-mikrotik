// app/api/billing-plans/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { mikrotikApi } from "@/config/mikrotikApi";
import "source-map-support/register";
import connectDB from "@/config/db";
import BillingPlans from "@/models/BillingPlans";

// Type for the request parameters
interface Params {
  id: string;
}

async function connectToApi() {
  await mikrotikApi.connect();
}

async function disconnectFromApi() {
  await mikrotikApi.close();
}

// Get single billing plan
export async function GET(
  request: NextRequest,
  { params }: { params: Params },
) {
  await connectDB();

  const { id } = params;

  try {
    const billingPlan = await BillingPlans.findOne({ mikrotikId: id });
    if (!billingPlan) {
      return NextResponse.json(
        { message: "Billing Plan not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ billingPlan }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Billing Plan:", error);
    return NextResponse.json(
      { message: "Failed to fetch Billing Plan" },
      { status: 500 },
    );
  }
}

// Update single billing plan
export async function PUT(req: NextRequest, { params }: { params: Params }) {
  const {
    "local-address": localAddress,
    name,
    "rate-limit": rateLimit,
    "remote-address": remoteAddress,
    price,
    duration,
    moduleType,
  } = await req.json();

  const { id } = params;

  try {
    await connectToApi();
    const mikrotikResult = await mikrotikApi.write(
      "/ppp/profile/set",
      [
        `=.id=${id}`,
        localAddress ? `=local-address=${localAddress}` : "",
        name ? `=name=${name}` : "",
        rateLimit ? `=rate-limit=${rateLimit}` : "",
        remoteAddress ? `=remote-address=${remoteAddress}` : "",
      ].filter(Boolean),
    );
    await disconnectFromApi();

    await connectDB();
    const billingPlan = await BillingPlans.findOneAndUpdate(
      { mikrotikId: id },
      {
        "local-address": localAddress,
        name,
        "rate-limit": rateLimit,
        "remote-address": remoteAddress,
        price,
        duration,
        moduleType,
      },
      { new: true },
    );

    return NextResponse.json(billingPlan);
  } catch (error) {
    console.error("Failed to update billing plan:", error);
    await disconnectFromApi();
    return NextResponse.json(
      { message: "Failed to update billing plan" },
      { status: 500 },
    );
  }
}

// Delete single billing plan
export async function DELETE(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;

  try {
    await connectToApi();
    const mikrotikResult = await mikrotikApi.write("/ppp/profile/remove", [
      `=.id=${id}`,
    ]);
    await disconnectFromApi();

    await connectDB();
    const billingPlan = await BillingPlans.findOneAndDelete({ mikrotikId: id });

    if (!billingPlan) {
      return NextResponse.json(
        { message: "Billing Plan not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(billingPlan, { status: 200 });
  } catch (error) {
    console.error("Failed to delete billing plan:", error);
    await disconnectFromApi();
    return NextResponse.json(
      { message: "Failed to delete billing plan" },
      { status: 500 },
    );
  }
}
