const Message = require("../models/Message");
const Proposal = require("../models/Proposal");
const { writeAuditLog } = require("../services/auditService");
const { serializeDoc, serializeList } = require("../utils/serialize");

async function listProposals(req, res) {
  const { status, profileId } = req.query;
  const query = { deletedAt: null };

  if (status) query.status = status;
  if (profileId) query.$or = [{ fromProfile: profileId }, { toProfile: profileId }];

  const proposals = await Proposal.find(query)
    .populate("fromProfile", "name gender age city nationality")
    .populate("toProfile", "name gender age city nationality")
    .sort({ updatedAt: -1 });

  res.json({ proposals: serializeList(proposals) });
}

async function createProposal(req, res) {
  const proposal = await Proposal.create(req.body);
  await writeAuditLog({ req, action: "proposal.create", entityType: "Proposal", entityId: String(proposal._id) });
  res.status(201).json({ proposal: serializeDoc(proposal) });
}

async function updateProposal(req, res) {
  const proposal = await Proposal.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!proposal) return res.status(404).json({ error: "Proposal not found" });
  return res.json({ proposal: serializeDoc(proposal) });
}

async function addMessage(req, res) {
  const proposal = await Proposal.findById(req.params.id);
  if (!proposal) return res.status(404).json({ error: "Proposal not found" });

  const message = await Message.create({
    proposalId: proposal._id,
    senderRole: req.body.senderRole || "Broker",
    body: req.body.body,
    approvalStatus: req.body.approvalStatus || "Pending Approval"
  });
  await writeAuditLog({ req, action: "message.create", entityType: "Message", entityId: String(message._id) });

  return res.status(201).json({ message: serializeDoc(message) });
}

async function listMessages(req, res) {
  const messages = await Message.find({ proposalId: req.params.id, deletedAt: null }).sort({ createdAt: 1 });
  res.json({ messages: serializeList(messages) });
}

async function moderateMessage(req, res) {
  const message = await Message.findByIdAndUpdate(
    req.params.messageId,
    { approvalStatus: req.body.approvalStatus },
    { new: true, runValidators: true }
  );
  if (!message) return res.status(404).json({ error: "Message not found" });
  await writeAuditLog({
    req,
    action: "message.moderate",
    entityType: "Message",
    entityId: String(message._id),
    metadata: { approvalStatus: message.approvalStatus }
  });
  return res.json({ message: serializeDoc(message) });
}

module.exports = {
  listProposals,
  createProposal,
  updateProposal,
  addMessage,
  listMessages,
  moderateMessage
};
