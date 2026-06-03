const mongoose = require("mongoose");
const crypto = require("crypto");

const savedSearchSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    name: { type: String, required: true, trim: true },
    filters: {
      gender: String,
      status: String,
      leadStage: String,
      nationality: String,
      residenceCountry: String,
      minAge: Number,
      maxAge: Number,
      religion: String,
      community: String,
      education: String,
      incomeMin: Number
    },
    alertEnabled: { type: Boolean, default: true },
    alertChannel: { type: String, enum: ["In-App", "SMS", "Email", "WhatsApp"], default: "In-App" },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedSearch", savedSearchSchema);
