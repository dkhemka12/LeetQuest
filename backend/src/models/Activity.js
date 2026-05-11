const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    topic: {
      type: String,
      default: "General",
    },
    difficulty: {
      type: String,
      default: "Easy",
    },
    solvedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

const Activity = mongoose.model("Activity", activitySchema);

module.exports = Activity;
