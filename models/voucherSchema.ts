// models/voucherSchema.js
import mongoose from "mongoose";

// Voucher Schema
const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  checkoutRequestID: { type: String, required: true },
  status: { type: String, default: "Unused" },
});

const Voucher =
  mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);

export default Voucher;
