const crypto = require("crypto");

const key = crypto
  .createHash("sha256")
  .update(process.env.FIELD_ENCRYPTION_KEY || "zawajlink-development-field-key")
  .digest();

function encryptText(value) {
  if (!value) return value;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(String(value), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:${iv.toString("base64url")}:${tag.toString("base64url")}:${encrypted.toString("base64url")}`;
}

function decryptText(value) {
  if (!String(value || "").startsWith("enc:")) return value;
  const [, ivText, tagText, encryptedText] = String(value).split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final()
  ]);
  return decrypted.toString("utf8");
}

module.exports = {
  encryptText,
  decryptText
};
