// models/BillingPlan.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBillingPlan extends Document {
  mikrotikId: string;
  "local-address": string;
  name: string;
  "rate-limit": string;
  "remote-address": string;
  price: number;
  duration: number; // duration in days or months, depending on your use case
  moduleType: string;
}

const BillingPlanSchema: Schema = new Schema({
  mikrotikId: { type: String, required: false },
  "local-address": { type: String, required: true },
  name: { type: String, required: true },
  "rate-limit": { type: String, required: true },
  "remote-address": { type: String, required: true },
  price: { type: Number, required: true },
  duration: { type: Number, required: true },
  moduleType: { type: String, required: true },
});

export default mongoose.models.BillingPlan ||
  mongoose.model<IBillingPlan>("BillingPlan", BillingPlanSchema);
