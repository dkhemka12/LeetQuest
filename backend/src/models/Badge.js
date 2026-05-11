const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "🏅",
    },
  },
  { timestamps: true },
);

const Badge = mongoose.model("Badge", badgeSchema);

module.exports = Badge;
