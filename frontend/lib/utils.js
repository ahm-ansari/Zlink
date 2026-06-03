export function toDateInput(value) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 10);
}

export function normalizePayload(form) {
  const payload = { ...form };
  ["age", "heightCm", "incomeLakhs", "preferredAgeMin", "preferredAgeMax", "serviceFeeQar"].forEach((key) => {
    payload[key] = payload[key] === "" ? undefined : Number(payload[key]);
  });
  payload.followUpDate = payload.followUpDate || undefined;
  return payload;
}

export function profileLabel(profile) {
  if (!profile) return "";
  return `${profile.name} (${profile.gender}, ${profile.age || "-"} yrs)`;
}
