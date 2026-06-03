const Notification = require("../models/Notification");
const { serializeDoc, serializeList } = require("../utils/serialize");

async function listNotifications(req, res) {
  const { status, channel } = req.query;
  const query = { deletedAt: null };
  if (status) query.status = status;
  if (channel) query.channel = channel;

  const notifications = await Notification.find(query).sort({ createdAt: -1 });
  res.json({ notifications: serializeList(notifications) });
}

async function queueNotification(req, res) {
  const notification = await Notification.create(req.body);
  res.status(201).json({ notification: serializeDoc(notification) });
}

async function updateNotification(req, res) {
  const notification = await Notification.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!notification) return res.status(404).json({ error: "Notification not found" });
  return res.json({ notification: serializeDoc(notification) });
}

module.exports = {
  listNotifications,
  queueNotification,
  updateNotification
};
