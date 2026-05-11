const leetcodeService = require("../services/leetcodeService");

const syncLeetcodeData = async (req, res) => {
  try {
    const leetcodeUsername =
      req.body.leetcodeUsername || req.user?.leetcodeUsername;
    const data = await leetcodeService.fetchLeetcodeSnapshot(leetcodeUsername);

    res.json({
      message: "LeetCode sync placeholder",
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getLeetcodeStatus = async (req, res) => {
  res.json({
    message: "LeetCode sync route ready",
    connected: Boolean(req.user?.leetcodeUsername),
  });
};

module.exports = {
  syncLeetcodeData,
  getLeetcodeStatus,
};
