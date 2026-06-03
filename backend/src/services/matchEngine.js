function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function splitList(value) {
  return String(value || "")
    .split(",")
    .map((item) => normalize(item))
    .filter(Boolean);
}

function containsMatch(listValue, candidateValue) {
  const items = splitList(listValue);
  const candidate = normalize(candidateValue);
  return items.some((item) => candidate.includes(item) || item.includes(candidate));
}

function withinPreferredAge(source, candidate) {
  const min = Number(source.preferredAgeMin);
  const max = Number(source.preferredAgeMax);

  if (!Number.isFinite(Number(candidate.age))) return false;
  if (Number.isFinite(min) && candidate.age < min) return false;
  if (Number.isFinite(max) && candidate.age > max) return false;
  return true;
}

function scorePair(source, candidate) {
  const reasons = [];
  let score = 0;

  if (source.gender === candidate.gender) {
    return { score: 0, reasons: ["Same gender profile"], candidate };
  }

  if (withinPreferredAge(source, candidate)) {
    score += 20;
    reasons.push("Age fits preference");
  }

  if (withinPreferredAge(candidate, source)) {
    score += 15;
    reasons.push("Mutual age expectation fits");
  }

  if (normalize(source.religion) && normalize(source.religion) === normalize(candidate.religion)) {
    score += 12;
    reasons.push("Same religion");
  }

  if (normalize(source.nationality) && normalize(source.nationality) === normalize(candidate.nationality)) {
    score += 7;
    reasons.push("Same nationality");
  } else if (containsMatch(source.preferredNationalities, candidate.nationality)) {
    score += 6;
    reasons.push("Nationality is in preference");
  }

  if (normalize(source.residenceCountry) && normalize(source.residenceCountry) === normalize(candidate.residenceCountry)) {
    score += 6;
    reasons.push("Same residence country");
  } else if (containsMatch(source.preferredResidenceCountries, candidate.residenceCountry)) {
    score += 5;
    reasons.push("Residence country is in preference");
  }

  if (normalize(source.community) && normalize(source.community) === normalize(candidate.community)) {
    score += 16;
    reasons.push("Same community");
  } else if (containsMatch(source.preferredCommunities, candidate.community)) {
    score += 12;
    reasons.push("Community is in preference");
  }

  if (normalize(source.motherTongue) && normalize(source.motherTongue) === normalize(candidate.motherTongue)) {
    score += 8;
    reasons.push("Same mother tongue");
  }

  if (normalize(source.city) && normalize(source.city) === normalize(candidate.city)) {
    score += 10;
    reasons.push("Same city");
  } else if (containsMatch(source.preferredCities, candidate.city)) {
    score += 8;
    reasons.push("City is in preference");
  }

  if (normalize(source.maritalStatus) === normalize(candidate.maritalStatus)) {
    score += 6;
    reasons.push("Same marital status expectation");
  }

  if (normalize(source.familyType) && normalize(source.familyType) === normalize(candidate.familyType)) {
    score += 5;
    reasons.push("Similar family type");
  }

  if (Number(candidate.incomeLakhs) >= 10) {
    score += 4;
    reasons.push("Professionally settled");
  }

  return {
    score: Math.min(score, 100),
    reasons: reasons.length ? reasons : ["Basic profile details available"],
    candidate
  };
}

function findMatches(sourceProfile, allProfiles, limit = 8) {
  return allProfiles
    .filter((profile) => String(profile._id || profile.id) !== String(sourceProfile._id || sourceProfile.id))
    .filter((profile) => profile.status !== "Archived")
    .map((candidate) => scorePair(sourceProfile, candidate))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || String(a.candidate.name).localeCompare(String(b.candidate.name)))
    .slice(0, limit);
}

module.exports = {
  findMatches,
  scorePair
};
