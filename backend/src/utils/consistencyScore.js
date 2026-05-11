const calculateConsistencyScore = (solvedDays = 0, activeDays = 0) => {
  if (!activeDays) {
    return 0;
  }

  return Math.round((solvedDays / activeDays) * 100);
};

module.exports = calculateConsistencyScore;
