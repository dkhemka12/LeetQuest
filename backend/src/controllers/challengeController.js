const Challenge = require("../models/Challenge");

const listChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find().sort({ createdAt: -1 });

    res.json({
      message: "Challenge list placeholder",
      challenges,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const createChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.create({
      creator: req.user?._id,
      opponent: req.body.opponent || null,
      topic: req.body.topic || "General",
      difficulty: req.body.difficulty || "Easy",
      targetQuestions: req.body.targetQuestions || 1,
      deadline: req.body.deadline || null,
      status: "open",
    });

    res.status(201).json({
      message: "Challenge created",
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

const updateChallengeStatus = async (req, res) => {
  try {
    const challenge = await Challenge.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status || "open" },
      { new: true },
    );

    if (!challenge) {
      return res.status(404).json({ message: "Challenge not found" });
    }

    res.json({
      message: "Challenge updated",
      challenge,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  listChallenges,
  createChallenge,
  updateChallengeStatus,
};
