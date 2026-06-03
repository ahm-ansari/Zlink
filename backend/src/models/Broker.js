const mongoose = require("mongoose");
const crypto = require("crypto");

const brokerSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    businessName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, required: true, trim: true },
    country: { type: String, default: "Qatar", trim: true },
    city: { type: String, default: "Doha", trim: true },
    role: { type: String, enum: ["Broker", "Admin", "Support"], default: "Broker" },
    verificationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Suspended"],
      default: "Pending"
    },
    mfaEnabled: { type: Boolean, default: false },
    subscriptionPlan: { type: String, enum: ["Starter", "Professional", "Agency"], default: "Starter" },
    documents: [
      {
        name: String,
        url: String,
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
      }
    ],
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

brokerSchema.index({ businessName: "text", contactName: "text", email: "text", phone: "text" });

module.exports = mongoose.model("Broker", brokerSchema);
