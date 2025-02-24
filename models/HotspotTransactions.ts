import mongoose from "mongoose";

// HotspotTransactions Schema
const hotspotTransactionSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true },
  accountNumber: { type: String, required: true },
  amount: { type: Number, required: true },
  checkoutRequestID: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

const HotspotTransactions =
  mongoose.models.HotspotTransactions ||
  mongoose.model("HotspotTransactions", hotspotTransactionSchema);

export default HotspotTransactions;
