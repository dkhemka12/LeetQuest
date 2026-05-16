const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
  getLeaderboardPreview,
  getUserActivityHistory,
  getUserPublicProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getUserProfile);
router.put("/me", protect, updateUserProfile);
router.get("/leaderboard", protect, getLeaderboardPreview);
router.get("/me/history", protect, getUserActivityHistory);
router.get("/:username/public", getUserPublicProfile);

module.exports = router;
