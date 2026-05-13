const Activity = require("../models/Activity");

const logActivity = async ({
  userId,
  title,
  topic = "General",
  difficulty = "Easy",
  solvedAt = new Date(),
}) => {
  if (!userId || !title) {
    return null;
  }

  return Activity.create({
    user: userId,
    title,
    topic,
    difficulty,
    solvedAt,
  });
};

module.exports = {
  logActivity,
};
