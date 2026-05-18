const Challenge = require("../models/Challenge");
const User = require("../models/User");

const challengePopulation = [
  { path: "creator", select: "username firstName lastName" },
  { path: "opponent", select: "username firstName lastName" },
  { path: "winner", select: "username firstName lastName" },
  { path: "clan", select: "name slug inviteCode" },
];

const topicQuestionBank = {
  Array: [
    { title: "Two Sum", slug: "two-sum", difficulty: "Easy" },
    {
      title: "Product of Array Except Self",
      slug: "product-of-array-except-self",
      difficulty: "Medium",
    },
    {
      title: "Container With Most Water",
      slug: "container-with-most-water",
      difficulty: "Medium",
    },
  ],
  Strings: [
    { title: "Valid Anagram", slug: "valid-anagram", difficulty: "Easy" },
    {
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "Medium",
    },
    { title: "Group Anagrams", slug: "group-anagrams", difficulty: "Medium" },
  ],
  "Hash Table": [
    { title: "Two Sum", slug: "two-sum", difficulty: "Easy" },
    {
      title: "Top K Frequent Elements",
      slug: "top-k-frequent-elements",
      difficulty: "Medium",
    },
    {
      title: "Subarray Sum Equals K",
      slug: "subarray-sum-equals-k",
      difficulty: "Medium",
    },
  ],
  "Linked List": [
    {
      title: "Reverse Linked List",
      slug: "reverse-linked-list",
      difficulty: "Easy",
    },
    {
      title: "Merge Two Sorted Lists",
      slug: "merge-two-sorted-lists",
      difficulty: "Easy",
    },
    {
      title: "Linked List Cycle",
      slug: "linked-list-cycle",
      difficulty: "Easy",
    },
  ],
  Stack: [
    {
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "Easy",
    },
    { title: "Min Stack", slug: "min-stack", difficulty: "Medium" },
    {
      title: "Daily Temperatures",
      slug: "daily-temperatures",
      difficulty: "Medium",
    },
  ],
  Queue: [
    {
      title: "Number of Recent Calls",
      slug: "number-of-recent-calls",
      difficulty: "Easy",
    },
    {
      title: "Implement Queue using Stacks",
      slug: "implement-queue-using-stacks",
      difficulty: "Easy",
    },
    {
      title: "Moving Average from Data Stream",
      slug: "moving-average-from-data-stream",
      difficulty: "Easy",
    },
  ],
  Tree: [
    {
      title: "Maximum Depth of Binary Tree",
      slug: "maximum-depth-of-binary-tree",
      difficulty: "Easy",
    },
    {
      title: "Binary Tree Level Order Traversal",
      slug: "binary-tree-level-order-traversal",
      difficulty: "Medium",
    },
    {
      title: "Invert Binary Tree",
      slug: "invert-binary-tree",
      difficulty: "Easy",
    },
  ],
  Graph: [
    {
      title: "Number of Islands",
      slug: "number-of-islands",
      difficulty: "Medium",
    },
    { title: "Clone Graph", slug: "clone-graph", difficulty: "Medium" },
    { title: "Course Schedule", slug: "course-schedule", difficulty: "Medium" },
  ],
  "Dynamic Programming": [
    { title: "Climbing Stairs", slug: "climbing-stairs", difficulty: "Easy" },
    { title: "House Robber", slug: "house-robber", difficulty: "Medium" },
    { title: "Coin Change", slug: "coin-change", difficulty: "Medium" },
  ],
  "Binary Search": [
    { title: "Binary Search", slug: "binary-search", difficulty: "Easy" },
    {
      title: "Search in Rotated Sorted Array",
      slug: "search-in-rotated-sorted-array",
      difficulty: "Medium",
    },
    {
      title: "Find First and Last Position of Element in Sorted Array",
      slug: "find-first-and-last-position-of-element-in-sorted-array",
      difficulty: "Medium",
    },
  ],
  Greedy: [
    { title: "Jump Game", slug: "jump-game", difficulty: "Medium" },
    {
      title: "Best Time to Buy and Sell Stock",
      slug: "best-time-to-buy-and-sell-stock",
      difficulty: "Easy",
    },
    { title: "Gas Station", slug: "gas-station", difficulty: "Medium" },
  ],
  "Sliding Window": [
    {
      title: "Longest Substring Without Repeating Characters",
      slug: "longest-substring-without-repeating-characters",
      difficulty: "Medium",
    },
    {
      title: "Minimum Window Substring",
      slug: "minimum-window-substring",
      difficulty: "Hard",
    },
    {
      title: "Permutation in String",
      slug: "permutation-in-string",
      difficulty: "Medium",
    },
  ],
  "Two Pointers": [
    {
      title: "Two Sum II - Input Array Is Sorted",
      slug: "two-sum-ii-input-array-is-sorted",
      difficulty: "Medium",
    },
    { title: "3Sum", slug: "3sum", difficulty: "Medium" },
    { title: "Valid Palindrome", slug: "valid-palindrome", difficulty: "Easy" },
  ],
  Backtracking: [
    { title: "Subsets", slug: "subsets", difficulty: "Medium" },
    { title: "Permutations", slug: "permutations", difficulty: "Medium" },
    { title: "Combination Sum", slug: "combination-sum", difficulty: "Medium" },
  ],
};

const defaultTopics = Object.keys(topicQuestionBank);

const normalizeTopics = (topics = []) =>
  Array.from(
    new Set(topics.map((topic) => String(topic || "").trim()).filter(Boolean)),
  );

const hashToIndex = (seed, length) => {
  if (!length) return 0;
  const text = String(seed || "");
  let hash = 0;

  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }

  return hash % length;
};

const buildChallengeQuestion = (topics, seed) => {
  const normalizedTopics = normalizeTopics(topics);
  const chosenTopics = normalizedTopics.length
    ? normalizedTopics
    : defaultTopics;
  const pool = chosenTopics.flatMap((topic) => topicQuestionBank[topic] || []);
  const fallbackPool = defaultTopics.flatMap(
    (topic) => topicQuestionBank[topic] || [],
  );
  const sourcePool = pool.length ? pool : fallbackPool;
  const question = sourcePool[hashToIndex(seed, sourcePool.length)];
  const topic =
    chosenTopics[hashToIndex(`${seed}:topic`, chosenTopics.length)] ||
    "General";

  return { topic, question };
};

const populateChallenge = async (challenge) =>
  challenge.populate(challengePopulation);

const listChallenges = async (req, res) => {
  try {
    const { all = "false" } = req.query;
    const challengeQuery =
      req.user?.isAdmin && all === "true"
        ? {}
        : {
            $or: [
              { creator: req.user._id },
              { opponent: req.user._id },
              { type: "daily", creator: req.user._id },
            ],
          };

    const challenges = await Challenge.find(challengeQuery)
      .sort({ createdAt: -1 })
      .populate(challengePopulation)
      .lean();

    res.json({ challenges });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const createChallenge = async (req, res) => {
  try {
    const deadline = req.body.deadline ? new Date(req.body.deadline) : null;
    const topics = normalizeTopics(
      req.body.topics || (req.body.topic ? [req.body.topic] : []),
    );
    const topic = String(req.body.topic || topics[0] || "General").trim();
    const challenge = await Challenge.create({
      title: String(req.body.title || "Friend Challenge").trim(),
      description: String(req.body.description || "").trim(),
      type: ["daily", "friend", "clan", "custom"].includes(req.body.type)
        ? req.body.type
        : "friend",
      creator: req.user?._id,
      opponent: req.body.opponent || null,
      clan: req.body.clan || null,
      topics,
      topic,
      questionSlug: String(req.body.questionSlug || "").trim(),
      questionTitle: String(req.body.questionTitle || "").trim(),
      questionUrl: String(req.body.questionUrl || "").trim(),
      difficulty: req.body.difficulty || "Easy",
      targetQuestions: Number(req.body.targetQuestions || 1),
      deadline: Number.isNaN(deadline?.getTime()) ? null : deadline,
      status: req.body.status || "open",
    });

    const populatedChallenge = await populateChallenge(challenge);

    res
      .status(201)
      .json({ message: "Challenge created", challenge: populatedChallenge });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getDailyChallenge = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1,
    );

    const existing = await Challenge.findOne({
      creator: req.user._id,
      type: "daily",
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    }).populate(challengePopulation);

    if (existing) {
      return res.json({ challenge: existing });
    }

    const user = await User.findById(req.user._id).select(
      "preferredTopics username",
    );
    const { topic, question } = buildChallengeQuestion(
      user?.preferredTopics || [],
      `${req.user._id}:${today.toISOString().slice(0, 10)}`,
    );

    const challenge = await Challenge.create({
      title: `${topic} Daily Challenge`,
      description: `Solve one ${topic.toLowerCase()} problem today and keep your streak alive.`,
      type: "daily",
      creator: req.user._id,
      topics: user?.preferredTopics || [topic],
      topic,
      questionSlug: question?.slug || "",
      questionTitle: question?.title || "",
      questionUrl: question?.slug
        ? `https://leetcode.com/problems/${question.slug}/`
        : "",
      difficulty: question?.difficulty || "Easy",
      targetQuestions: 1,
      deadline: endOfDay,
      status: "open",
    });

    const populatedChallenge = await populateChallenge(challenge);

    res.status(201).json({ challenge: populatedChallenge });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const getDailyTopicOptions = async (req, res) => {
  try {
    res.json({ topics: defaultTopics });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateChallengeStatus = async (req, res) => {
  try {
    const update = {
      status: req.body.status || "open",
    };

    if (req.body.winner !== undefined) {
      update.winner = req.body.winner || null;
    }

    if (update.status === "completed") {
      update.completedAt = new Date();
    }

    const challenge = await Challenge.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).populate(challengePopulation);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge updated", challenge });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndDelete(req.params.id);

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({ message: "Challenge deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  listChallenges,
  createChallenge,
  getDailyChallenge,
  getDailyTopicOptions,
  updateChallengeStatus,
  deleteChallenge,
};
