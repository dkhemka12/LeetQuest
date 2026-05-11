const express = require("express");
const router = express.Router();

const {
  listChallenges,
  createChallenge,
  updateChallengeStatus,
} = require("../controllers/challengeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/", protect, listChallenges);
router.post("/", protect, createChallenge);
router.patch("/:id/status", protect, updateChallengeStatus);

module.exports = router;
