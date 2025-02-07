import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
  transactionId: { type: String, required: true, unique: true },
  amount: { type: Number, required: true },
  phoneNumber: { type: String, required: true },
  accountNumber: { type: String, required: true }, // This is the client's account number
  status: { type: String, enum: ["pending", "processed"], default: "pending" },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Transaction ||
  mongoose.model("Transaction", TransactionSchema);
