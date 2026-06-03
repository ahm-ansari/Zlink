const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const { authenticate } = require("../middleware/auth");
const { registerBroker, login, me, refresh, logout } = require("../controllers/authController");

const router = express.Router();

router.post("/auth/register-broker", asyncHandler(registerBroker));
router.post("/auth/login", asyncHandler(login));
router.post("/auth/refresh", asyncHandler(refresh));
router.post("/auth/logout", asyncHandler(logout));
router.get("/auth/me", authenticate, asyncHandler(me));

module.exports = router;
