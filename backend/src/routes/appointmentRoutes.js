const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { listAppointments, createAppointment, updateAppointment } = require("../controllers/appointmentController");

const router = express.Router();

router.get("/appointments", asyncHandler(listAppointments));
router.post("/appointments", asyncHandler(createAppointment));
router.put("/appointments/:id", asyncHandler(updateAppointment));

module.exports = router;
