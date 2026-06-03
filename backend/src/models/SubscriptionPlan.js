const mongoose = require("mongoose");
const crypto = require("crypto");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    name: { type: String, required: true, unique: true },
    monthlyPriceQar: { type: Number, required: true, min: 0 },
    maxProfiles: { type: Number, required: true, min: 1 },
    features: [{ type: String }],
    active: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);
