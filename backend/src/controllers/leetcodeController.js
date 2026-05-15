const leetcodeService = require("../services/leetcodeService");
const User = require("../models/User");
const Activity = require("../models/Activity");
const calculateLevel = require("../utils/calculateLevel");
const { calculateXpForProblem } = require("../services/xpService");
const { logActivity } = require("../services/activityService");

const syncLeetcodeData = async (req, res) => {
  try {
    const leetcodeUsername =
      req.body.leetcodeUsername || req.user?.leetcodeUsername;

    if (!leetcodeUsername) {
      return res.status(400).json({
        message: "Please provide a LeetCode username before syncing.",
      });
    }

    const data = await leetcodeService.fetchLeetcodeSnapshot(leetcodeUsername);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const easySolved = Number(data.easySolved || 0);
    const mediumSolved = Number(data.mediumSolved || 0);
    const hardSolved = Number(data.hardSolved || 0);

    const xp =
      easySolved * calculateXpForProblem("Easy") +
      mediumSolved * calculateXpForProblem("Medium") +
      hardSolved * calculateXpForProblem("Hard");

    user.leetcodeUsername =
      data.leetcodeUsername || leetcodeUsername || user.leetcodeUsername;
    user.easySolved = easySolved;
    user.mediumSolved = mediumSolved;
    user.hardSolved = hardSolved;
    user.xp = xp;
    user.level = calculateLevel(xp);
    user.lastSyncedAt = new Date();

    await user.save();

    await logActivity({
      userId: user._id,
      title: `Synced LeetCode profile (${user.leetcodeUsername || "unlinked"})`,
      topic: "Sync",
      difficulty: "Easy",
    }).catch(() => null);

    if (Array.isArray(data.recentSubmissions)) {
      const submissions = data.recentSubmissions.slice(0, 8);

      // Check for duplicates before logging
      const existingActivities = await Activity.find({
        user: user._id,
        topic: "LeetCode",
      })
        .select("title solvedAt")
        .lean();

      const existingSet = new Set(
        existingActivities.map(
          (a) => `${a.title}||${a.solvedAt ? a.solvedAt.toISOString() : ""}`,
        ),
      );

      await Promise.all(
        submissions.map((submission) => {
          const difficulty = submission?.difficulty || "Easy";
          const title = submission?.title || "Solved problem";
          const topic = submission?.topic || "LeetCode";
          const solvedAt = submission?.solvedAt
            ? new Date(submission.solvedAt)
            : new Date();

          const key = `${title}||${solvedAt.toISOString()}`;
          if (existingSet.has(key)) {
            console.log(`Skipping duplicate activity: ${title}`);
            return null;
          }

          return logActivity({
            userId: user._id,
            title,
            topic,
            difficulty,
            solvedAt,
          }).catch(() => null);
        }),
      );
    }

    res.json({
      message: "LeetCode sync completed",
      data,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

const getLeetcodeStatus = async (req, res) => {
  res.json({
    message: "LeetCode sync route ready",
    connected: Boolean(req.user?.leetcodeUsername),
  });
};

const clearAndResyncLeetcode = async (req, res) => {
  try {
    const leetcodeUsername = req.user?.leetcodeUsername;

    if (!leetcodeUsername) {
      return res.status(400).json({
        message: "Please set your LeetCode username first.",
      });
    }

    // Delete all LeetCode-related activities for this user
    await Activity.deleteMany({
      user: req.user._id,
      topic: "LeetCode",
    });

    console.log(`Cleared activities for user ${req.user._id}`);

    // Now perform fresh sync
    const data = await leetcodeService.fetchLeetcodeSnapshot(leetcodeUsername);

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const easySolved = Number(data.easySolved || 0);
    const mediumSolved = Number(data.mediumSolved || 0);
    const hardSolved = Number(data.hardSolved || 0);

    const xp =
      easySolved * calculateXpForProblem("Easy") +
      mediumSolved * calculateXpForProblem("Medium") +
      hardSolved * calculateXpForProblem("Hard");

    user.leetcodeUsername =
      data.leetcodeUsername || leetcodeUsername || user.leetcodeUsername;
    user.easySolved = easySolved;
    user.mediumSolved = mediumSolved;
    user.hardSolved = hardSolved;
    user.xp = xp;
    user.level = calculateLevel(xp);
    user.lastSyncedAt = new Date();

    await user.save();

    await logActivity({
      userId: user._id,
      title: `Cleared and re-synced LeetCode profile (${user.leetcodeUsername || "unlinked"})`,
      topic: "Sync",
      difficulty: "Easy",
    }).catch(() => null);

    // Log fresh activities (no duplicates since we just cleared)
    if (Array.isArray(data.recentSubmissions)) {
      const submissions = data.recentSubmissions.slice(0, 8);

      await Promise.all(
        submissions.map((submission) => {
          const difficulty = submission?.difficulty || "Easy";
          const title = submission?.title || "Solved problem";
          const topic = submission?.topic || "LeetCode";
          const solvedAt = submission?.solvedAt
            ? new Date(submission.solvedAt)
            : new Date();

          return logActivity({
            userId: user._id,
            title,
            topic,
            difficulty,
            solvedAt,
          }).catch(() => null);
        }),
      );
    }

    res.json({
      message: "Activities cleared and fresh sync completed",
      data,
    });
  } catch (error) {
    res
      .status(error.statusCode || 500)
      .json({ message: error.message || "Server error" });
  }
};

module.exports = {
  syncLeetcodeData,
  getLeetcodeStatus,
  clearAndResyncLeetcode,
};
