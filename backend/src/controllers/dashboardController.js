const User = require("../models/User");
const Activity = require("../models/Activity");
const { buildActivityAnalytics } = require("../utils/activityAnalytics");

const getDashboardSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username xp level streak consistencyScore easySolved mediumSolved hardSolved badges",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaderboard = await User.find({ isBanned: false, isAdmin: false })
      .select("username xp level streak isAdmin")
      .sort({ xp: -1 })
      .limit(5)
      .lean();

    const leetcodeActivities = await Activity.find({
      user: req.user._id,
      topic: "LeetCode",
    })
      .sort({ solvedAt: -1 })
      .select("title topic difficulty solvedAt")
      .lean();

    const activityAnalytics = buildActivityAnalytics(leetcodeActivities);

    const easySolved = user.easySolved || 0;
    const mediumSolved = user.mediumSolved || 0;
    const hardSolved = user.hardSolved || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    res.json({
      summary: {
        username: user.username,
        xp: user.xp || 0,
        level: user.level || 1,
        streak: activityAnalytics.streak,
        consistencyScore: activityAnalytics.consistencyScore,
        badgesCount: user.badges?.length || 0,
        solved: {
          easy: easySolved,
          medium: mediumSolved,
          hard: hardSolved,
          total: totalSolved,
        },
      },
      chartData: [
        { name: "Easy", solved: easySolved },
        { name: "Medium", solved: mediumSolved },
        { name: "Hard", solved: hardSolved },
      ],
      leaderboard,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getAnalyticsOverview = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "xp streak consistencyScore easySolved mediumSolved hardSolved",
    );

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

    const easySolved = user.easySolved || 0;
    const mediumSolved = user.mediumSolved || 0;
    const hardSolved = user.hardSolved || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    res.json({
      summary: {
        activityCount: activityAnalytics.activityCount,
        xp: user.xp || 0,
        streak: activityAnalytics.streak,
        consistencyScore: activityAnalytics.consistencyScore,
        totalSolved,
      },
      difficultyBreakdown: [
        { name: "Easy", solved: easySolved },
        { name: "Medium", solved: mediumSolved },
        { name: "Hard", solved: hardSolved },
      ],
      weeklyActivity: activityAnalytics.weeklyActivity,
      recentActivities: activityAnalytics.recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getDashboardSummary,
  getAnalyticsOverview,
};
