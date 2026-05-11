const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  getLeaderboardPreview,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.get("/leaderboard", protect, getLeaderboardPreview);

module.exports = router;
