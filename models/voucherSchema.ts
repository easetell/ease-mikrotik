// models/voucherSchema.js
import mongoose from "mongoose";

const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Username (e.g., "EASETELL")
  password: { type: String, required: true, unique: true }, // Password (voucher) - Unique
  phoneNumber: { type: String, required: true }, // Phone number associated with the voucher
  checkoutRequestID: { type: String, required: true, unique: true }, // CheckoutRequestID from M-Pesa
  status: { type: String, enum: ["Unused", "Used"], default: "Unused" }, // Voucher status
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
});

const Voucher =
  mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);

export default Voucher;
