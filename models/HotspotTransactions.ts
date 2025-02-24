import mongoose from "mongoose";

// HotspotTransactions Schema
const hotspotTransactionSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  mpesaReceiptNumber: { type: String, required: true },
  voucherCode: { type: String, required: true },
  checkoutRequestID: { type: String, required: true },
  status: { type: String, default: "Success" },
});

const HotspotTransactions =
  mongoose.models.HotspotTransactions ||
  mongoose.model("HotspotTransactions", hotspotTransactionSchema);

export default HotspotTransactions;
