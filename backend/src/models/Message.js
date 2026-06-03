const mongoose = require("mongoose");
const crypto = require("crypto");

const messageSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    proposalId: { type: mongoose.Schema.Types.ObjectId, ref: "Proposal", required: true },
    senderRole: { type: String, enum: ["Broker", "Admin", "Support", "Limited Client View"], default: "Broker" },
    body: { type: String, required: true, trim: true },
    approvalStatus: {
      type: String,
      enum: ["Pending Approval", "Approved", "Rejected"],
      default: "Pending Approval"
    },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);
