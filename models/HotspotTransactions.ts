// models/HotspotTransactions.js
import mongoose from "mongoose";

const hotspotTransactionSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true }, // Phone number of the user
  accountNumber: { type: String, required: true }, // Account reference (e.g., package name or phone number)
  amount: { type: Number, required: true }, // Amount paid
  mpesaReceiptNumber: { type: String, required: true, unique: true }, // M-Pesa receipt number
  voucherCode: { type: String, required: true }, // Voucher code generated
  checkoutRequestID: { type: String, required: true, unique: true }, // CheckoutRequestID from M-Pesa
  status: { type: String, enum: ["Success", "Failed"], default: "Success" }, // Transaction status
  createdAt: { type: Date, default: Date.now }, // Timestamp of creation
});

const HotspotTransactions =
  mongoose.models.HotspotTransactions ||
  mongoose.model("HotspotTransactions", hotspotTransactionSchema);

export default HotspotTransactions;
