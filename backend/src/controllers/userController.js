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

const getUserActivityHistory = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 20, 1), 50);
    const skip = (page - 1) * limit;

    const match = {
      user: req.user._id,
      topic: "LeetCode",
      titleSlug: { $exists: true, $ne: "" },
    };

    const [activities, totalResult] = await Promise.all([
      Activity.aggregate([
        { $match: match },
        { $sort: { solvedAt: -1 } },
        {
          $group: {
            _id: "$titleSlug",
            title: { $first: "$title" },
            titleSlug: { $first: "$titleSlug" },
            difficulty: { $first: "$difficulty" },
            solvedAt: { $first: "$solvedAt" },
          },
        },
        { $sort: { solvedAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]),
      Activity.aggregate([
        { $match: match },
        { $group: { _id: "$titleSlug" } },
        { $count: "total" },
      ]),
    ]);

    const total = totalResult[0]?.total || 0;
    const user = await User.findById(req.user._id)
      .select("easySolved mediumSolved hardSolved")
      .lean();
    const leetcodeSolvedTotal =
      Number(user?.easySolved || 0) +
      Number(user?.mediumSolved || 0) +
      Number(user?.hardSolved || 0);

    // Format activities with question URLs
    const formattedActivities = activities.map((activity) => ({
      ...activity,
      _id: activity._id,
      questionUrl: activity.titleSlug
        ? `https://leetcode.com/problems/${activity.titleSlug}/`
        : null,
    }));

    res.json({
      activities: formattedActivities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
        syncedQuestionTotal: total,
        leetcodeSolvedTotal,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getUserPublicProfile = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username }).select(
      "username firstName lastName xp level streak consistencyScore easySolved mediumSolved hardSolved leetcodeUsername createdAt",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get recent activities (public display)
    const recentActivities = await Activity.find({ user: user._id })
      .sort({ solvedAt: -1 })
      .limit(10)
      .select("title titleSlug difficulty solvedAt -_id")
      .lean();

    const formattedActivities = recentActivities.map((activity) => ({
      ...activity,
      questionUrl: activity.titleSlug
        ? `https://leetcode.com/problems/${activity.titleSlug}/`
        : null,
    }));

    res.json({
      ...user.toObject(),
      recentActivities: formattedActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getLeaderboardPreview,
  getUserActivityHistory,
  getUserPublicProfile,
};
