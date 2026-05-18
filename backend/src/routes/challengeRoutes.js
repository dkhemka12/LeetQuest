const express = require("express");
const router = express.Router();

const {
  listChallenges,
  createChallenge,
  getDailyChallenge,
  getDailyTopicOptions,
  updateChallengeStatus,
  deleteChallenge,
} = require("../controllers/challengeController");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", protect, listChallenges);
router.get("/daily", protect, getDailyChallenge);
router.get("/daily-topics", protect, getDailyTopicOptions);
router.post("/", protect, createChallenge);
router.patch("/:id/status", protect, updateChallengeStatus);
router.delete("/:id", protect, adminMiddleware, deleteChallenge);

module.exports = router;
