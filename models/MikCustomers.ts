// models/Customer.ts
import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  mikrotikId: string; // Corresponds to the MikroTik secret ID
  name: string;
  password: string;
  service: string;
  profile: string;
  callerId: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  expiryDate: Date;
  location: string;
  idNumber: string;
  "caller-id": string;
}

const CustomerSchema: Schema = new Schema({
  mikrotikId: { type: String, required: false },
  name: { type: String, required: true },
  password: { type: String, required: true },
  service: { type: String, required: true },
  profile: { type: String, required: true },
  "caller-id": { type: String, required: false },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  expiryDate: { type: Date, required: true },
  location: { type: String, required: true },
  idNumber: { type: String, required: true },
});

export default mongoose.models.MikCustomer ||
  mongoose.model<ICustomer>("MikCustomer", CustomerSchema);
