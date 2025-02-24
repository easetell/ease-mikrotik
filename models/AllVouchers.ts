import mongoose from "mongoose";

// allVoucherSchema Schema
const allVoucherSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  profile: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  checkoutRequestID: { type: String, required: true },
  status: { type: String, default: "Unused" },
  createdAt: { type: Date, default: Date.now },
  isPremium: { type: Boolean, default: true }, // Additional field for premium vouchers
});

const AllVoucher =
  mongoose.models.AllVouchers || mongoose.model("AllVoucher", allVoucherSchema);

export default AllVoucher;
