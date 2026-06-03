const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { listBrokers, getBroker, updateBroker, verifyBroker } = require("../controllers/brokerController");

const router = express.Router();

router.get("/brokers", asyncHandler(listBrokers));
router.get("/brokers/:id", asyncHandler(getBroker));
router.put("/brokers/:id", asyncHandler(updateBroker));
router.patch("/brokers/:id/verification", asyncHandler(verifyBroker));

module.exports = router;
