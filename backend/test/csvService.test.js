const test = require("node:test");
const assert = require("node:assert/strict");
const { parseCsv, profilesToCsv } = require("../src/services/csvService");

test("profilesToCsv escapes commas and quotes", () => {
  const csv = profilesToCsv([{ name: 'Aisha "A"', city: "Doha, Qatar", gender: "Bride" }]);
  assert.match(csv, /"Aisha ""A"""/);
  assert.match(csv, /"Doha, Qatar"/);
});

test("parseCsv returns records keyed by header", () => {
  const records = parseCsv("name,gender,age\nAisha,Bride,25\nOmar,Groom,29");
  assert.equal(records.length, 2);
  assert.deepEqual(records[0], { name: "Aisha", gender: "Bride", age: "25" });
});
