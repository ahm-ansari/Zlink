const Profile = require("../models/Profile");
const Proposal = require("../models/Proposal");

async function brokerReport(_req, res) {
  const [pipeline, payments, proposals] = await Promise.all([
    Profile.aggregate([{ $group: { _id: "$leadStage", count: { $sum: 1 } } }]),
    Profile.aggregate([{ $group: { _id: "$clientPaymentStatus", count: { $sum: 1 }, totalQar: { $sum: "$serviceFeeQar" } } }]),
    Proposal.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }])
  ]);

  res.json({
    pipeline,
    payments,
    proposals
  });
}

async function platformAnalytics(_req, res) {
  const [profilesByCountry, profilesByGender, profilesByVerification] = await Promise.all([
    Profile.aggregate([{ $group: { _id: "$residenceCountry", count: { $sum: 1 } } }]),
    Profile.aggregate([{ $group: { _id: "$gender", count: { $sum: 1 } } }]),
    Profile.aggregate([{ $group: { _id: "$verificationStatus", count: { $sum: 1 } } }])
  ]);

  res.json({
    profilesByCountry,
    profilesByGender,
    profilesByVerification
  });
}

module.exports = {
  brokerReport,
  platformAnalytics
};
