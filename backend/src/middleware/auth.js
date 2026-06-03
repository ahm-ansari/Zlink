const User = require("../models/User");
const { verify } = require("../services/tokenService");

async function authenticate(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const payload = verify(token);

  if (!payload) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const user = await User.findById(payload.sub).select("-passwordHash -passwordSalt");
  if (!user || user.status !== "Active") {
    return res.status(401).json({ error: "Invalid or inactive user" });
  }

  req.user = user;
  return next();
}

function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Insufficient permissions" });
    }
    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};
