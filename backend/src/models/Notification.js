const mongoose = require("mongoose");
const crypto = require("crypto");

const notificationSchema = new mongoose.Schema(
  {
    uuid: { type: String, default: () => crypto.randomUUID(), unique: true, index: true },
    brokerId: { type: mongoose.Schema.Types.ObjectId, ref: "Broker" },
    channel: { type: String, enum: ["In-App", "SMS", "Email", "WhatsApp"], default: "In-App" },
    recipient: { type: String, trim: true },
    title: { type: String, required: true, trim: true },
    body: { type: String, trim: true },
    status: { type: String, enum: ["Queued", "Sent", "Failed"], default: "Queued" },
    deletedAt: { type: Date, default: null, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
