const getUnlockedBadges = (user) => {
  const badges = [];

  if ((user?.streak || 0) >= 7) {
    badges.push("7 Day Streak");
  }

  if ((user?.streak || 0) >= 30) {
    badges.push("30 Day Streak");
  }

  if ((user?.hardSolved || 0) >= 25) {
    badges.push("Graph Master");
  }

  if ((user?.mediumSolved || 0) >= 50) {
    badges.push("DP Warrior");
  }

  if ((user?.xp || 0) >= 1000) {
    badges.push("Contest Expert");
  }

  return badges;
};

module.exports = {
  getUnlockedBadges,
};
