const express = require("express");
const asyncHandler = require("../utils/asyncHandler");
const {
  listProposals,
  createProposal,
  updateProposal,
  addMessage,
  listMessages,
  moderateMessage
} = require("../controllers/proposalController");

const router = express.Router();

router.get("/proposals", asyncHandler(listProposals));
router.post("/proposals", asyncHandler(createProposal));
router.put("/proposals/:id", asyncHandler(updateProposal));
router.get("/proposals/:id/messages", asyncHandler(listMessages));
router.post("/proposals/:id/messages", asyncHandler(addMessage));
router.patch("/messages/:messageId/moderation", asyncHandler(moderateMessage));

module.exports = router;
