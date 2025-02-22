import mongoose from "mongoose";

const HotspotTransactionSchema = new mongoose.Schema(
  {
    phoneNumber: { type: String, required: true },
    accountNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    mpesaReceiptNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

export default mongoose.models.HotspotTransaction ||
  mongoose.model("HotspotTransaction", HotspotTransactionSchema);
