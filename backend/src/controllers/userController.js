const User = require("../models/User");
const Activity = require("../models/Activity");
const Clan = require("../models/Clan");
const { buildActivityAnalytics } = require("../utils/activityAnalytics");

const normalizeClanName = (name) =>
  name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const makeInviteCode = () =>
  Math.random().toString(36).slice(2, 8).toUpperCase();

const clanMemberProjection =
  "username firstName lastName xp level streak consistencyScore leetcodeUsername";

const clanOwnerProjection = "username firstName lastName";

const clanMessageProjection = "author body createdAt";

const buildClanScore = (clan) => {
  const members = clan.members || [];

  return members.reduce((score, member) => {
    const xp = Number(member?.xp || 0);
    const streak = Number(member?.streak || 0);
    const consistencyScore = Number(member?.consistencyScore || 0);

    return score + xp + streak * 25 + consistencyScore * 10;
  }, members.length * 100);
};

const decorateClan = (clan) => ({
  ...clan,
  score: buildClanScore(clan),
  memberCount: clan.members?.length || 0,
  messages: (clan.messages || []).map((message) => ({
    ...message,
    author: message.author,
  })),
});

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

const searchUsers = async (req, res) => {
  try {
    const query = String(req.query.q || "").trim();
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 10, 1),
      20,
    );

    if (!query) {
      return res.json({ users: [] });
    }

    const regex = new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { username: regex },
        { firstName: regex },
        { lastName: regex },
        { leetcodeUsername: regex },
      ],
    })
      .sort({ xp: -1, level: -1, username: 1 })
      .limit(limit)
      .select(
        "username firstName lastName xp level streak consistencyScore leetcodeUsername",
      )
      .lean();

    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate(
        "friends",
        "username firstName lastName xp level streak consistencyScore leetcodeUsername",
      )
      .select("friends")
      .lean();

    res.json({ friends: user?.friends || [] });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const addFriend = async (req, res) => {
  try {
    const friendId = req.params.userId;

    if (String(friendId) === String(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You cannot add yourself as a friend" });
    }

    const friend = await User.findById(friendId).select("_id username");
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    await Promise.all([
      User.updateOne(
        { _id: req.user._id },
        { $addToSet: { friends: friend._id } },
      ),
      User.updateOne(
        { _id: friend._id },
        { $addToSet: { friends: req.user._id } },
      ),
    ]);

    const refreshedUser = await User.findById(req.user._id)
      .populate(
        "friends",
        "username firstName lastName xp level streak consistencyScore leetcodeUsername",
      )
      .select("friends")
      .lean();

    res.json({
      message: `Connected with ${friend.username}`,
      friends: refreshedUser?.friends || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const removeFriend = async (req, res) => {
  try {
    const friendId = req.params.userId;

    await Promise.all([
      User.updateOne({ _id: req.user._id }, { $pull: { friends: friendId } }),
      User.updateOne({ _id: friendId }, { $pull: { friends: req.user._id } }),
    ]);

    const refreshedUser = await User.findById(req.user._id)
      .populate(
        "friends",
        "username firstName lastName xp level streak consistencyScore leetcodeUsername",
      )
      .select("friends")
      .lean();

    res.json({
      message: "Friend removed",
      friends: refreshedUser?.friends || [],
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getClans = async (req, res) => {
  try {
    const clans = await Clan.find()
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    const rankedClans = clans
      .map((clan) => ({
        ...decorateClan(clan),
        isMine: clan.members?.some(
          (member) => String(member._id) === String(req.user._id),
        ),
      }))
      .sort((left, right) => right.score - left.score);

    res.json({ clans: rankedClans });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getMyClan = async (req, res) => {
  try {
    const clan = await Clan.findOne({ members: req.user._id })
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    if (!clan) {
      return res.json({ clan: null });
    }

    res.json({
      clan: decorateClan(clan),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const createClan = async (req, res) => {
  try {
    const name = String(req.body.name || "").trim();

    if (name.length < 3) {
      return res
        .status(400)
        .json({ message: "Clan name must be at least 3 characters" });
    }

    const slug = normalizeClanName(name);
    if (!slug) {
      return res
        .status(400)
        .json({ message: "Please choose a valid clan name" });
    }

    const existingClan = await Clan.findOne({
      $or: [{ slug }, { name: new RegExp(`^${name}$`, "i") }],
    });
    if (existingClan) {
      return res
        .status(400)
        .json({ message: "That clan name is already taken" });
    }

    const clan = await Clan.create({
      name,
      slug,
      inviteCode: makeInviteCode(),
      owner: req.user._id,
      members: [req.user._id],
    });

    const populatedClan = await Clan.findById(clan._id)
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    res.status(201).json({
      message: "Clan created",
      clan: decorateClan(populatedClan),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const joinClan = async (req, res) => {
  try {
    const inviteCode = String(req.body.inviteCode || "")
      .trim()
      .toUpperCase();

    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const clan = await Clan.findOne({ inviteCode });
    if (!clan) {
      return res.status(404).json({ message: "Clan not found" });
    }

    if (
      clan.members.some((memberId) => String(memberId) === String(req.user._id))
    ) {
      return res.status(400).json({ message: "You are already in this clan" });
    }

    clan.members.push(req.user._id);
    await clan.save();

    const populatedClan = await Clan.findById(clan._id)
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    res.json({
      message: `Joined ${clan.name}`,
      clan: decorateClan(populatedClan),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const leaveClan = async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.clanId);

    if (!clan) {
      return res.status(404).json({ message: "Clan not found" });
    }

    clan.members = clan.members.filter(
      (memberId) => String(memberId) !== String(req.user._id),
    );

    if (
      String(clan.owner) === String(req.user._id) &&
      clan.members.length > 0
    ) {
      clan.owner = clan.members[0];
    }

    if (clan.members.length === 0) {
      await Clan.deleteOne({ _id: clan._id });
      return res.json({ message: "Clan removed" });
    }

    await clan.save();

    const populatedClan = await Clan.findById(clan._id)
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    res.json({
      message: "Left clan",
      clan: decorateClan(populatedClan),
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getClanTownhall = async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.clanId)
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    if (!clan) {
      return res.status(404).json({ message: "Clan not found" });
    }

    if (
      !clan.members.some(
        (member) => String(member._id) === String(req.user._id),
      )
    ) {
      return res
        .status(403)
        .json({ message: "Join the clan to view its townhall" });
    }

    res.json({ clan: decorateClan(clan) });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const postClanTownhallMessage = async (req, res) => {
  try {
    const clan = await Clan.findById(req.params.clanId);

    if (!clan) {
      return res.status(404).json({ message: "Clan not found" });
    }

    if (
      !clan.members.some(
        (memberId) => String(memberId) === String(req.user._id),
      )
    ) {
      return res
        .status(403)
        .json({ message: "Join the clan to message everyone" });
    }

    const body = String(req.body.body || "").trim();
    if (!body) {
      return res.status(400).json({ message: "Message cannot be empty" });
    }

    clan.messages = clan.messages || [];
    clan.messages.unshift({ author: req.user._id, body });
    clan.messages = clan.messages.slice(0, 30);
    await clan.save();

    const populatedClan = await Clan.findById(clan._id)
      .populate("owner", clanOwnerProjection)
      .populate("members", clanMemberProjection)
      .populate("messages.author", clanMemberProjection)
      .lean();

    res.status(201).json({
      message: "Townhall message posted",
      clan: decorateClan(populatedClan),
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
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      50,
    );
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
};
