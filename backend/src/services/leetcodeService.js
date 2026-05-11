const fetchLeetcodeSnapshot = async (leetcodeUsername) => {
  if (!leetcodeUsername) {
    return {
      leetcodeUsername: "",
      totalSolved: 0,
      easySolved: 0,
      mediumSolved: 0,
      hardSolved: 0,
      recentSubmissions: [],
      contestStats: [],
      topics: [],
    };
  }

  return {
    leetcodeUsername,
    totalSolved: 0,
    easySolved: 0,
    mediumSolved: 0,
    hardSolved: 0,
    recentSubmissions: [],
    contestStats: [],
    topics: [],
  };
};

module.exports = {
  fetchLeetcodeSnapshot,
};
