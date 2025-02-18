import { Schema, model } from "mongoose";

const TransactionSchema = new Schema({
  transactionId: { type: String, required: true, unique: true }, // Unique transaction ID from M-Pesa
  amount: { type: Number, required: true }, // Payment amount
  phoneNumber: { type: String, required: true }, // Customer's phone number
  accountNumber: { type: String, required: true }, // Client's account number (BillRefNumber)
  status: { type: String, enum: ["pending", "processed"], default: "pending" }, // Transaction status
  timestamp: { type: Date, default: Date.now }, // Timestamp of the transaction
});

export default model("Transaction", TransactionSchema);
