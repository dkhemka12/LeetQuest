const User = require("../models/User");
const Activity = require("../models/Activity");

const getDashboardSummary = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "username xp level streak consistencyScore easySolved mediumSolved hardSolved badges",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const leaderboard = await User.find({ isBanned: false })
      .select("username xp level streak")
      .sort({ xp: -1 })
      .limit(5)
      .lean();

    const easySolved = user.easySolved || 0;
    const mediumSolved = user.mediumSolved || 0;
    const hardSolved = user.hardSolved || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    res.json({
      summary: {
        username: user.username,
        xp: user.xp || 0,
        level: user.level || 1,
        streak: user.streak || 0,
        consistencyScore: user.consistencyScore || 0,
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

    const activityCount = await Activity.countDocuments({ user: req.user._id });

    const recentActivities = await Activity.find({ user: req.user._id })
      .sort({ solvedAt: -1 })
      .limit(8)
      .select("title topic difficulty solvedAt")
      .lean();

    const weeklyRaw = await Activity.aggregate([
      {
        $match: {
          user: req.user._id,
          solvedAt: {
            $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$solvedAt",
            },
          },
          solved: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const weeklyMap = new Map(
      weeklyRaw.map((entry) => [entry._id, entry.solved]),
    );
    const weeklyActivity = [];

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);

      const key = date.toISOString().slice(0, 10);
      weeklyActivity.push({
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        solved: weeklyMap.get(key) || 0,
      });
    }

    const easySolved = user.easySolved || 0;
    const mediumSolved = user.mediumSolved || 0;
    const hardSolved = user.hardSolved || 0;
    const totalSolved = easySolved + mediumSolved + hardSolved;

    res.json({
      summary: {
        activityCount,
        xp: user.xp || 0,
        streak: user.streak || 0,
        consistencyScore: user.consistencyScore || 0,
        totalSolved,
      },
      difficultyBreakdown: [
        { name: "Easy", solved: easySolved },
        { name: "Medium", solved: mediumSolved },
        { name: "Hard", solved: hardSolved },
      ],
      weeklyActivity,
      recentActivities,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getDashboardSummary,
  getAnalyticsOverview,
};
