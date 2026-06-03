const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { listPlans, createPlan, updatePlan } = require("../controllers/subscriptionController");

const router = express.Router();

router.get("/subscription-plans", asyncHandler(listPlans));
router.post("/subscription-plans", asyncHandler(createPlan));
router.put("/subscription-plans/:id", asyncHandler(updatePlan));

module.exports = router;
