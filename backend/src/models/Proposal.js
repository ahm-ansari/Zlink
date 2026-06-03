const mongoose = require("mongoose");
const crypto = require("crypto");

const proposalSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    fromProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    toProfile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile", required: true },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Interested", "Family Review", "Meeting Scheduled", "Accepted", "Declined", "Closed"],
      default: "Draft"
    },
    approvalRequired: { type: Boolean, default: true },
    message: { type: String, trim: true },
    appointmentAt: { type: Date },
    notes: { type: String, trim: true },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proposal", proposalSchema);
