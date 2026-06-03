const crypto = require("crypto");

const secret = process.env.JWT_SECRET || "zawajlink-development-secret";

function base64url(input) {
  return Buffer.from(input).toString("base64url");
}

function sign(payload, expiresInSeconds = 60 * 60 * 8) {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const body = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds
  };
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(body))}`;
  const signature = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");
  return `${unsigned}.${signature}`;
}

function verify(token) {
  const [header, payload, signature] = String(token || "").split(".");
  if (!header || !payload || !signature) return null;

  const unsigned = `${header}.${payload}`;
  const expected = crypto.createHmac("sha256", secret).update(unsigned).digest("base64url");
  if (Buffer.byteLength(signature) !== Buffer.byteLength(expected)) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

  const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) return null;
  return decoded;
}

module.exports = {
  sign,
  verify
};
