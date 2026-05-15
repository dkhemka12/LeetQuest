const calculateConsistencyScore = require("./consistencyScore");

const toDayKey = (date) => {
  const normalized = new Date(date);
  normalized.setHours(0, 0, 0, 0);
  return normalized.toISOString().slice(0, 10);
};

const dedupeActivities = (activities = []) => {
  const seen = new Set();

  return activities.filter((activity) => {
    const solvedAt = activity?.solvedAt ? new Date(activity.solvedAt) : null;
    const key = `${activity?.title || ""}||${solvedAt ? solvedAt.toISOString() : ""}`;

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
};

const buildActivityAnalytics = (activities = []) => {
  const problemActivities = dedupeActivities(
    activities.filter((activity) => activity?.topic === "LeetCode"),
  )
    .slice()
    .sort((left, right) => new Date(right.solvedAt) - new Date(left.solvedAt));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const solvedDaySet = new Set(
    problemActivities.map((activity) => toDayKey(activity.solvedAt)),
  );

  const latestSolvedDay = problemActivities.length
    ? new Date(problemActivities[0].solvedAt)
    : null;

  if (latestSolvedDay) {
    latestSolvedDay.setHours(0, 0, 0, 0);
  }

  let streak = 0;
  const streakAnchor = latestSolvedDay || today;

  for (let offset = 0; offset < 3650; offset += 1) {
    const date = new Date(streakAnchor);
    date.setDate(streakAnchor.getDate() - offset);

    if (solvedDaySet.has(toDayKey(date))) {
      streak += 1;
    } else {
      break;
    }
  }

  const last30Start = new Date(today);
  last30Start.setDate(today.getDate() - 29);

  const activeDaysLast30 = new Set(
    problemActivities
      .filter((activity) => new Date(activity.solvedAt) >= last30Start)
      .map((activity) => toDayKey(activity.solvedAt)),
  ).size;

  const weeklyActivity = [];
  const weeklyMap = new Map();

  problemActivities.forEach((activity) => {
    const solvedAt = new Date(activity.solvedAt);
    if (Number.isNaN(solvedAt.getTime())) {
      return;
    }

    const diffDays = Math.floor(
      (today.getTime() - new Date(toDayKey(solvedAt)).getTime()) /
        (24 * 60 * 60 * 1000),
    );
    if (diffDays >= 0 && diffDays < 7) {
      const key = toDayKey(solvedAt);
      weeklyMap.set(key, (weeklyMap.get(key) || 0) + 1);
    }
  });

  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = toDayKey(date);

    weeklyActivity.push({
      day: date.toLocaleDateString("en-US", { weekday: "short" }),
      solved: weeklyMap.get(key) || 0,
    });
  }

  return {
    activityCount: problemActivities.length,
    weeklyActivity,
    recentActivities: problemActivities.slice(0, 5),
    streak,
    consistencyScore: calculateConsistencyScore(activeDaysLast30, 30),
  };
};

module.exports = {
  buildActivityAnalytics,
  dedupeActivities,
  toDayKey,
};
