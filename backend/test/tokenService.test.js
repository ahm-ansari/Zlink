const test = require("node:test");
const assert = require("node:assert/strict");
const { sign, verify } = require("../src/services/tokenService");

test("sign and verify token payload", () => {
  const token = sign({ sub: "user-1", role: "Broker" }, 60);
  const payload = verify(token);
  assert.equal(payload.sub, "user-1");
  assert.equal(payload.role, "Broker");
});

test("verify rejects malformed tokens", () => {
  assert.equal(verify("bad.token.value"), null);
});
