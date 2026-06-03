const Broker = require("../models/Broker");
const User = require("../models/User");
const { writeAuditLog } = require("../services/auditService");
const { serializeDoc, serializeList } = require("../utils/serialize");

async function listBrokers(req, res) {
  const { status, search } = req.query;
  const query = { deletedAt: null };

  if (status) query.verificationStatus = status;
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [{ businessName: regex }, { contactName: regex }, { email: regex }, { phone: regex }];
  }

  const brokers = await Broker.find(query).sort({ createdAt: -1 });
  res.json({ brokers: serializeList(brokers) });
}

async function getBroker(req, res) {
  const broker = await Broker.findById(req.params.id);
  if (!broker) return res.status(404).json({ error: "Broker not found" });
  return res.json({ broker: serializeDoc(broker) });
}

async function updateBroker(req, res) {
  const broker = await Broker.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!broker) return res.status(404).json({ error: "Broker not found" });
  return res.json({ broker: serializeDoc(broker) });
}

async function verifyBroker(req, res) {
  const { verificationStatus } = req.body;
  const broker = await Broker.findByIdAndUpdate(
    req.params.id,
    { verificationStatus },
    { new: true, runValidators: true }
  );

  if (!broker) return res.status(404).json({ error: "Broker not found" });

  const userStatus = verificationStatus === "Approved" ? "Active" : "Pending Verification";
  await User.updateMany({ brokerId: broker._id }, { status: userStatus });
  await writeAuditLog({
    req,
    action: "broker.verification",
    entityType: "Broker",
    entityId: String(broker._id),
    metadata: { verificationStatus }
  });

  return res.json({ broker: serializeDoc(broker) });
}

module.exports = {
  listBrokers,
  getBroker,
  updateBroker,
  verifyBroker
};
