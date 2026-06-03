const Profile = require("../models/Profile");

async function getDashboard(req, res) {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const [
    totalProfiles,
    activeProfiles,
    brides,
    grooms,
    followUpsDue,
    pendingProfiles,
    verifiedProfiles,
    proposalStageProfiles,
    unpaidClientFees
  ] = await Promise.all([
    Profile.countDocuments(),
    Profile.countDocuments({ status: "Active" }),
    Profile.countDocuments({ status: "Active", gender: "Bride" }),
    Profile.countDocuments({ status: "Active", gender: "Groom" }),
    Profile.countDocuments({ followUpDate: { $lte: today }, status: { $ne: "Archived" } }),
    Profile.countDocuments({ status: "Pending" }),
    Profile.countDocuments({ verificationStatus: "Verified" }),
    Profile.countDocuments({ leadStage: "Proposal" }),
    Profile.countDocuments({ clientPaymentStatus: { $in: ["Unpaid", "Part Paid"] }, status: { $ne: "Archived" } })
  ]);

  res.json({
    totalProfiles,
    activeProfiles,
    brides,
    grooms,
    followUpsDue,
    pendingProfiles,
    verifiedProfiles,
    proposalStageProfiles,
    unpaidClientFees
  });
}

module.exports = {
  getDashboard
};
