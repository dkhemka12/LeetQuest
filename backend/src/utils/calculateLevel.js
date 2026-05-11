const calculateLevel = (xp) => {
  if (xp >= 2000) return 10;
  if (xp >= 1500) return 9;
  if (xp >= 1100) return 8;
  if (xp >= 800) return 7;
  if (xp >= 550) return 6;
  if (xp >= 350) return 5;
  if (xp >= 200) return 4;
  if (xp >= 100) return 3;
  if (xp >= 30) return 2;

  return 1;
};

module.exports = calculateLevel;
