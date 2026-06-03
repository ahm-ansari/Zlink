const express = require("express");
const { requireFields } = require("../middleware/validate");
const {
  listProfiles,
  createProfile,
  getProfile,
  updateProfile,
  deleteProfile,
  exportProfiles,
  importProfiles,
  getMatches
} = require("../controllers/profileController");

const router = express.Router();

router.get("/profiles", listProfiles);
router.get("/profiles/search", listProfiles);
router.post("/profiles", requireFields("name", "gender", "age"), createProfile);
router.get("/profiles-export", exportProfiles);
router.post("/profiles-import", importProfiles);
router.get("/profiles/:id", getProfile);
router.put("/profiles/:id", updateProfile);
router.delete("/profiles/:id", deleteProfile);
router.get("/matches/:id", getMatches);

module.exports = router;
