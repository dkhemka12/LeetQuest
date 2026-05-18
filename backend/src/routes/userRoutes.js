const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  searchUsers,
  getUserFriends,
  addFriend,
  removeFriend,
  getClans,
  getMyClan,
  createClan,
  joinClan,
  leaveClan,
  getClanTownhall,
  postClanTownhallMessage,
  updateUserProfile,
  getLeaderboardPreview,
  getUserActivityHistory,
  getUserPublicProfile,
} = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");

router.get("/me", protect, getUserProfile);
router.get("/search", protect, searchUsers);
router.get("/me/friends", protect, getUserFriends);
router.post("/me/friends/:userId", protect, addFriend);
router.delete("/me/friends/:userId", protect, removeFriend);
router.get("/clans/me", protect, getMyClan);
router.get("/clans", protect, getClans);
router.post("/clans", protect, createClan);
router.post("/clans/join", protect, joinClan);
router.post("/clans/:clanId/leave", protect, leaveClan);
router.get("/clans/:clanId/townhall", protect, getClanTownhall);
router.post("/clans/:clanId/townhall", protect, postClanTownhallMessage);
router.put("/me", protect, updateUserProfile);
router.get("/leaderboard", protect, getLeaderboardPreview);
router.get("/me/history", protect, getUserActivityHistory);
router.get("/:username/public", getUserPublicProfile);

module.exports = router;
