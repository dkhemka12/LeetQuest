const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    type: {
      type: String,
      enum: ["daily", "friend", "clan", "custom"],
      default: "friend",
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    opponent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    clan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Clan",
      default: null,
    },
    topics: [
      {
        type: String,
        trim: true,
      },
    ],
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    questionSlug: {
      type: String,
      default: "",
      trim: true,
    },
    questionTitle: {
      type: String,
      default: "",
      trim: true,
    },
    questionUrl: {
      type: String,
      default: "",
      trim: true,
    },
    difficulty: {
      type: String,
      default: "Easy",
    },
    targetQuestions: {
      type: Number,
      default: 1,
    },
    deadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ["open", "active", "completed", "cancelled"],
      default: "open",
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const Challenge = mongoose.model("Challenge", challengeSchema);

module.exports = Challenge;
