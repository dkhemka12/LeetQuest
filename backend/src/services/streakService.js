const updateStreak = (user, solvedToday) => {
  const currentStreak = user?.streak || 0;

  if (solvedToday) {
    return currentStreak + 1;
  }

  return 0;
};

const isStreakActive = (user) => (user?.streak || 0) > 0;

module.exports = {
  updateStreak,
  isStreakActive,
};
