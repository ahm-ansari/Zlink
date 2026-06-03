const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  listSavedSearches,
  createSavedSearch,
  updateSavedSearch
} = require("../controllers/savedSearchController");

const router = express.Router();

router.get("/saved-searches", asyncHandler(listSavedSearches));
router.post("/saved-searches", asyncHandler(createSavedSearch));
router.put("/saved-searches/:id", asyncHandler(updateSavedSearch));

module.exports = router;
