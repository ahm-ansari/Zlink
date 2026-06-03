const AuditLog = require("../models/AuditLog");

async function writeAuditLog({ req, action, entityType, entityId, metadata }) {
  await AuditLog.create({
    requestId: req.id,
    actorId: req.user?._id,
    actorRole: req.user?.role,
    action,
    entityType,
    entityId,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"],
    metadata
  });
}

module.exports = {
  writeAuditLog
};
