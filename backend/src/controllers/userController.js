const User = require("../models/User");
const Activity = require("../models/Activity");
const { buildActivityAnalytics } = require("../utils/activityAnalytics");

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const leetcodeActivities = await Activity.find({
      user: req.user._id,
      topic: "LeetCode",
    })
      .sort({ solvedAt: -1 })
      .select("title topic difficulty solvedAt")
      .lean();

    const activityAnalytics = buildActivityAnalytics(leetcodeActivities);

    res.json({
      ...user.toObject(),
      streak: activityAnalytics.streak,
      consistencyScore: activityAnalytics.consistencyScore,
      activityCount: activityAnalytics.activityCount,
      lastSyncedAt: user.lastSyncedAt,
      profileComplete: Boolean(user.firstName && user.lastName),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        username: req.body.username,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        leetcodeUsername: req.body.leetcodeUsername,
      },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getLeaderboardPreview = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ xp: -1 })
      .limit(10)
      .select("username xp level streak consistencyScore");

    res.json({
      message: "Leaderboard preview placeholder",
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getLeaderboardPreview,
};
