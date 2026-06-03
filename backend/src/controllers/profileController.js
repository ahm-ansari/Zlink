const Profile = require("../models/Profile");
const { findMatches } = require("../services/matchEngine");
const { parseCsv, profilesToCsv } = require("../services/csvService");
const { writeAuditLog } = require("../services/auditService");
const { serializeDoc } = require("../utils/serialize");

function cleanProfile(profile) {
  return serializeDoc(profile);
}

async function listProfiles(req, res) {
  const { search, gender, status, nationality, residenceCountry, leadStage } = req.query;
  const query = { deletedAt: null };

  if (gender) query.gender = gender;
  if (status) query.status = status;
  if (nationality) query.nationality = nationality;
  if (residenceCountry) query.residenceCountry = residenceCountry;
  if (leadStage) query.leadStage = leadStage;
  if (search) {
    const regex = new RegExp(search, "i");
    query.$or = [
      { name: regex },
      { city: regex },
      { community: regex },
      { occupation: regex },
      { phone: regex },
      { nationality: regex },
      { residenceCountry: regex }
    ];
  }

  const profiles = await Profile.find(query).sort({ updatedAt: -1 });
  res.json({ profiles: profiles.map(cleanProfile) });
}

async function createProfile(req, res) {
  const profile = await Profile.create(req.body);
  await writeAuditLog({ req, action: "profile.create", entityType: "Profile", entityId: String(profile._id) });
  res.status(201).json({ profile: cleanProfile(profile) });
}

async function getProfile(req, res) {
  const profile = await Profile.findById(req.params.id);
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  await writeAuditLog({ req, action: "profile.update", entityType: "Profile", entityId: String(profile._id) });
  return res.json({ profile: cleanProfile(profile) });
}

async function updateProfile(req, res) {
  const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!profile) return res.status(404).json({ error: "Profile not found" });
  return res.json({ profile: cleanProfile(profile) });
}

async function deleteProfile(req, res) {
  const profile = await Profile.findByIdAndUpdate(req.params.id, { deletedAt: new Date(), status: "Archived" }, { new: true });
  if (!profile) return res.status(404).json({ error: "Profile not found" });
  await writeAuditLog({ req, action: "profile.delete", entityType: "Profile", entityId: String(profile._id) });
  return res.json({ profile: cleanProfile(profile) });
}

async function exportProfiles(req, res) {
  const profiles = await Profile.find({ status: { $ne: "Archived" }, deletedAt: null }).sort({ updatedAt: -1 });
  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", "attachment; filename=zawajlink-profiles.csv");
  res.send(profilesToCsv(profiles.map(cleanProfile)));
}

async function importProfiles(req, res) {
  const { csv } = req.body;
  if (!csv) return res.status(400).json({ error: "csv body field is required" });

  const rows = parseCsv(csv).map((row) => ({
    ...row,
    age: row.age ? Number(row.age) : undefined,
    serviceFeeQar: row.serviceFeeQar ? Number(row.serviceFeeQar) : undefined
  }));

  const profiles = await Profile.insertMany(rows, { ordered: false });
  return res.status(201).json({ imported: profiles.length, profiles: profiles.map(cleanProfile) });
}

async function getMatches(req, res) {
  const profile = await Profile.findById(req.params.id);
  if (!profile) return res.status(404).json({ error: "Profile not found" });

  const profiles = await Profile.find({ status: { $ne: "Archived" }, deletedAt: null });
  const matches = findMatches(cleanProfile(profile), profiles.map(cleanProfile));
  return res.json({ profile: cleanProfile(profile), matches });
}

module.exports = {
  listProfiles,
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  exportProfiles,
  importProfiles,
  getMatches
};
