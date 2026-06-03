const mongoose = require("mongoose");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    phone: { type: String, trim: true },
    passwordHash: { type: String, required: true },
    passwordSalt: { type: String, required: true },
    role: {
      type: String,
      enum: ["Broker", "Admin", "Support", "Limited Client View"],
      default: "Broker"
    },
    status: {
      type: String,
      enum: ["Active", "Pending Verification", "Suspended"],
      default: "Pending Verification"
    },
    mfaEnabled: { type: Boolean, default: false },
    lastLoginAt: { type: Date },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
