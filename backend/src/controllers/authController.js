const Broker = require("../models/Broker");
const RefreshToken = require("../models/RefreshToken");
const User = require("../models/User");
const crypto = require("crypto");
const { hashPassword, verifyPassword } = require("../services/passwordService");
const { sign } = require("../services/tokenService");
const { serializeDoc } = require("../utils/serialize");

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueRefreshToken(user, req) {
  const refreshToken = crypto.randomBytes(48).toString("base64url");
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(refreshToken),
    expiresAt,
    ipAddress: req.ip,
    userAgent: req.headers["user-agent"]
  });
  return refreshToken;
}

async function registerBroker(req, res) {
  const { businessName, contactName, email, phone, country, city, password } = req.body;

  if (!businessName || !contactName || !email || !phone || !password) {
    return res.status(400).json({ error: "businessName, contactName, email, phone, and password are required" });
  }

  const existing = await User.findOne({ email: String(email).toLowerCase() });
  if (existing) return res.status(409).json({ error: "Email is already registered" });

  const broker = await Broker.create({
    businessName,
    contactName,
    email,
    phone,
    country,
    city,
    verificationStatus: "Pending"
  });

  const { salt, hash } = hashPassword(password);
  const user = await User.create({
    brokerId: broker._id,
    name: contactName,
    email,
    phone,
    passwordHash: hash,
    passwordSalt: salt,
    role: "Broker",
    status: "Pending Verification"
  });

  return res.status(201).json({
    broker: serializeDoc(broker),
    user: serializeDoc({ ...user.toObject(), passwordHash: undefined, passwordSalt: undefined })
  });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: String(email || "").toLowerCase() });

  if (!user || !verifyPassword(password || "", user.passwordSalt, user.passwordHash)) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  user.lastLoginAt = new Date();
  await user.save();

  const token = sign({ sub: String(user._id), role: user.role, brokerId: user.brokerId ? String(user.brokerId) : null }, 60 * 15);
  const refreshToken = await issueRefreshToken(user, req);
  const safeUser = user.toObject();
  delete safeUser.passwordHash;
  delete safeUser.passwordSalt;

  return res.json({ token, refreshToken, user: serializeDoc(safeUser) });
}

async function me(req, res) {
  return res.json({ user: serializeDoc(req.user) });
}

async function refresh(req, res) {
  const { refreshToken } = req.body;
  const stored = await RefreshToken.findOne({
    tokenHash: hashToken(refreshToken || ""),
    revokedAt: null,
    expiresAt: { $gt: new Date() }
  });

  if (!stored) return res.status(401).json({ error: "Invalid refresh token" });

  const user = await User.findById(stored.userId);
  if (!user || user.status !== "Active") return res.status(401).json({ error: "Invalid user" });

  const token = sign({ sub: String(user._id), role: user.role, brokerId: user.brokerId ? String(user.brokerId) : null }, 60 * 15);
  return res.json({ token });
}

async function logout(req, res) {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.updateOne({ tokenHash: hashToken(refreshToken) }, { revokedAt: new Date() });
  }
  return res.json({ ok: true });
}

module.exports = {
  registerBroker,
  login,
  me,
  refresh,
  logout
};
