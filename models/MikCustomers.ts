import mongoose, { Schema, Document } from "mongoose";

export interface ICustomer extends Document {
  mikrotikId: string;
  name: string;
  password: string;
  service: string;
  profile: string;
  callerId: string;
  phoneNumber: string;
  email: string;
  gender: string;
  firstName: string;
  lastName: string;
  expiryDate: Date;
  building: string;
  locationCod: string;
  idNumber: string;
  "caller-id": string;
  status: { type: String; enum: ["active", "inactive"]; default: "active" };
  lastPayment: {
    amount: Number;
    transactionId: String;
    phone: String;
    date: Date;
  };
  comment: string; // Add the comment field
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
  building: { type: String, required: true },
  idNumber: { type: String, required: true },
  locationCod: { type: String, required: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  lastPayment: {
    amount: Number,
    transactionId: String,
    phone: String,
    date: Date,
  },
  comment: { type: String, required: false }, // Add the comment field
});

export default mongoose.models.MikCustomer ||
  mongoose.model<ICustomer>("MikCustomer", CustomerSchema);
