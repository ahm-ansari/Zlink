const mongoose = require("mongoose");
const crypto = require("crypto");

const appointmentSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    proposalId: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal" },
    profileId: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    title: { type: String, required: true, trim: true },
    scheduledAt: { type: Date, required: true },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled"
    },
    notes: { type: String, trim: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
