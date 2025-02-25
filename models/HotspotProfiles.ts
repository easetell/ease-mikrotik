import mongoose from "mongoose";

const HotspotProfileSchema = new mongoose.Schema({
  mikrotikId: { type: String, required: true },
  name: { type: String, required: true },
  "address-pool": { type: String, required: true },
  "session-timeout": { type: String, required: true },
  "shared-users": { type: Number, required: true },
  "rate-limit": { type: String, required: true },
  price: { type: Number, required: true },
  moduleType: { type: String, required: true },
});

const HotspotProfiles = mongoose.models.HotspotProfiles || mongoose.model("HotspotProfiles", HotspotProfileSchema);
export default HotspotProfiles;
