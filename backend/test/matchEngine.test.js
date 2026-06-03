const test = require("node:test");
const assert = require("node:assert/strict");
const { findMatches, scorePair } = require("../src/services/matchEngine");

test("scores opposite profiles with shared preferences higher", () => {
  const bride = {
    id: "P-1",
    gender: "Bride",
    age: 26,
    religion: "Hindu",
    community: "Iyer",
    motherTongue: "Tamil",
    city: "Chennai",
    maritalStatus: "Never Married",
    familyType: "Nuclear",
    preferredAgeMin: 27,
    preferredAgeMax: 32,
    preferredCities: "Chennai, Bengaluru",
    preferredCommunities: "Iyer, Iyengar"
  };

  const groom = {
    id: "P-2",
    gender: "Groom",
    age: 29,
    religion: "Hindu",
    community: "Iyer",
    motherTongue: "Tamil",
    city: "Bengaluru",
    maritalStatus: "Never Married",
    familyType: "Nuclear",
    incomeLakhs: 24,
    preferredAgeMin: 24,
    preferredAgeMax: 28
  };

  const result = scorePair(bride, groom);
  assert.equal(result.score > 70, true);
  assert.equal(result.reasons.includes("Age fits preference"), true);
});

test("findMatches excludes same gender and archived profiles", () => {
  const source = { id: "P-1", gender: "Bride", age: 27, preferredAgeMin: 28, preferredAgeMax: 35 };
  const matches = findMatches(source, [
    source,
    { id: "P-2", gender: "Bride", age: 28, status: "Active" },
    { id: "P-3", gender: "Groom", age: 30, status: "Archived" },
    { id: "P-4", gender: "Groom", age: 31, status: "Active" }
  ]);

  assert.deepEqual(matches.map((match) => match.candidate.id), ["P-4"]);
});
