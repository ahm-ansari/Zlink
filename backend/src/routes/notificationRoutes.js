const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  listNotifications,
  queueNotification,
  updateNotification
} = require("../controllers/notificationController");

const router = express.Router();

router.get("/notifications", asyncHandler(listNotifications));
router.post("/notifications", asyncHandler(queueNotification));
router.put("/notifications/:id", asyncHandler(updateNotification));

module.exports = router;
