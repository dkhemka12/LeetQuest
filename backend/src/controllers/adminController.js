const User = require("../models/User");
const Activity = require("../models/Activity");
const Challenge = require("../models/Challenge");
const Clan = require("../models/Clan");

// Get all users with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "" } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch users", error: err.message });
  }
};

// Get user details
const getUserDetails = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId)
      .select("-password")
      .populate("friends");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch user", error: err.message });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin deletion of themselves
    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own admin account" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete user activities
    await Activity.deleteMany({ user: userId });

    res.json({ message: "User deleted successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete user", error: err.message });
  }
};

// Ban/Suspend user
const banUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason = "" } = req.body;

    // Prevent self-ban
    if (userId === req.user._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot ban your own admin account" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: true, bannedReason: reason },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User banned successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Failed to ban user", error: err.message });
  }
};

// Unban user
const unbanUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndUpdate(
      userId,
      { isBanned: false, bannedReason: "" },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User unbanned successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to unban user", error: err.message });
  }
};

// Update user (admin can modify any user data)
const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { username, email, xp, level, streak, isAdmin } = req.body;

    const updateData = {};
    if (username !== undefined) updateData.username = username;
    if (email !== undefined) updateData.email = email;
    if (xp !== undefined) updateData.xp = xp;
    if (level !== undefined) updateData.level = level;
    if (streak !== undefined) updateData.streak = streak;
    if (isAdmin !== undefined) {
      // Prevent removing own admin status
      if (userId === req.user._id.toString() && isAdmin === false) {
        return res
          .status(400)
          .json({ message: "Cannot remove your own admin status" });
      }
      updateData.isAdmin = isAdmin;
    }

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update user", error: err.message });
  }
};

// Get user activity logs
const getUserActivity = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const activities = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(Number(limit));

    res.json({ userId, activities });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch activity logs", error: err.message });
  }
};

// Get admin stats/dashboard
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const adminUsers = await User.countDocuments({ isAdmin: true });
    const totalChallenges = await Challenge.countDocuments();
    const activeChallenges = await Challenge.countDocuments({
      status: { $in: ["open", "active"] },
    });
    const dailyChallenges = await Challenge.countDocuments({ type: "daily" });
    const totalClans = await Clan.countDocuments();
    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      stats: {
        totalUsers,
        bannedUsers,
        adminUsers,
        activeUsers: totalUsers - bannedUsers,
        totalChallenges,
        activeChallenges,
        dailyChallenges,
        totalClans,
      },
      recentUsers,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch stats", error: err.message });
  }
};

const getAllChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .sort({ createdAt: -1 })
      .populate(
        "creator opponent winner clan",
        "username firstName lastName name slug inviteCode",
      );

    res.json({ challenges });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch challenges", error: err.message });
  }
};

const createAdminChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create({
      title: req.body.title || "Admin Challenge",
      description: req.body.description || "",
      type: req.body.type || "custom",
      creator: req.user._id,
      opponent: req.body.opponent || null,
      clan: req.body.clan || null,
      topics: Array.isArray(req.body.topics) ? req.body.topics : [],
      topic: req.body.topic || "General",
      questionSlug: req.body.questionSlug || "",
      questionTitle: req.body.questionTitle || "",
      questionUrl: req.body.questionUrl || "",
      difficulty: req.body.difficulty || "Easy",
      targetQuestions: req.body.targetQuestions || 1,
      deadline: req.body.deadline || null,
      status: req.body.status || "open",
    });

    res.status(201).json({ challenge });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to create challenge", error: err.message });
  }
};

const updateAdminChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.challengeId,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ challenge });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update challenge", error: err.message });
  }
};

const deleteAdminChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.challengeId);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete challenge", error: err.message });
  }
};

const getAllClans = async (req, res) => {
  try {
    const clans = await Clan.find()
      .sort({ createdAt: -1 })
      .populate("owner", "username firstName lastName")
      .populate("members", "username firstName lastName xp level")
      .lean();

    res.json({ clans });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch clans", error: err.message });
  }
};

const deleteClan = async (req, res) => {
  try {
    const clan = await Clan.findByIdAndDelete(req.params.clanId);

    if (!clan) {
      return res.status(404).json({ message: "Clan not found" });
    }

    res.json({ message: "Clan deleted" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete clan", error: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserDetails,
  deleteUser,
  banUser,
  unbanUser,
  updateUser,
  getUserActivity,
  getAdminStats,
  getAllChallenges,
  createAdminChallenge,
  updateAdminChallenge,
  deleteAdminChallenge,
  getAllClans,
  deleteClan,
};
