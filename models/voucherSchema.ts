import mongoose from "mongoose";

// Voucher Schema
const voucherSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Voucher code
  password: { type: String, required: true }, // Voucher password
  profile: { type: String, required: true }, // Profile name (e.g., "2 HOURS")
  phoneNumber: { type: String, required: true }, // User's phone number
  checkoutRequestID: { type: String, required: true }, // M-Pesa checkout request ID
  status: { type: String, default: "Unused" }, // Voucher status (e.g., "Unused", "Used")
  createdAt: { type: Date, default: Date.now }, // Creation time
  expiryTime: { type: Date, required: true }, // Expiry time (calculated based on profile's session-timeout)
});

const Voucher =
  mongoose.models.Voucher || mongoose.model("Voucher", voucherSchema);

export default Voucher;
