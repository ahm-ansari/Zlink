const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { brokerReport, platformAnalytics } = require("../controllers/reportController");

const router = express.Router();

router.get("/reports/broker", asyncHandler(brokerReport));
router.get("/reports/platform", asyncHandler(platformAnalytics));

module.exports = router;
