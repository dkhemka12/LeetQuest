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

    res.json({
      message: "Dashboard summary placeholder",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getAnalyticsOverview = async (req, res) => {
  try {
    const activityCount = await Activity.countDocuments({ user: req.user._id });

    res.json({
      message: "Analytics overview placeholder",
      activityCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  getDashboardSummary,
  getAnalyticsOverview,
};
