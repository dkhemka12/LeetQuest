const calculateLevel = require("../utils/calculateLevel");

const XP_BY_DIFFICULTY = {
  Easy: 10,
  Medium: 25,
  Hard: 50,
};

const calculateXpForProblem = (difficulty) => {
  return XP_BY_DIFFICULTY[difficulty] || XP_BY_DIFFICULTY.Easy;
};

const calculateUserProgress = (user) => {
  const xp = user?.xp || 0;

  return {
    xp,
    level: calculateLevel(xp),
  };
};

module.exports = {
  calculateXpForProblem,
  calculateUserProgress,
};
