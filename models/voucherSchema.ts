import mongoose from "mongoose";

const VoucherSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    status: {
      type: String,
      enum: ["Unused", "Used", "Expired"],
      default: "Unused",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Voucher ||
  mongoose.model("Voucher", VoucherSchema);
