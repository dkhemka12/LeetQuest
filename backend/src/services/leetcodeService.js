const axios = require("axios");

const LEETCODE_GRAPHQL_URL = "https://leetcode.com/graphql";
const RECENT_SUBMISSION_LIMIT = 100;

const buildEmptySnapshot = (leetcodeUsername = "") => ({
  leetcodeUsername,
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  recentSubmissions: [],
  contestStats: [],
  topics: [],
});

const fetchLeetcodeSnapshot = async (leetcodeUsername) => {
  const normalizedUsername = (leetcodeUsername || "").trim();

  if (!normalizedUsername) {
    return buildEmptySnapshot();
  }

  const profileQuery = `
    query userPublicProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
          starRating
        }
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
  `;

  const submissionsQuery = `
    query recentAcSubmissions($username: String!) {
      recentAcSubmissionList(username: $username, limit: ${RECENT_SUBMISSION_LIMIT}) {
        id
        title
        titleSlug
        timestamp
      }
    }
  `;

  const [profileResponse, submissionsResponse] = await Promise.all([
    axios.post(
      LEETCODE_GRAPHQL_URL,
      {
        query: profileQuery,
        variables: { username: normalizedUsername },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: `https://leetcode.com/${normalizedUsername}/`,
        },
        timeout: 12000,
      },
    ),
    axios.post(
      LEETCODE_GRAPHQL_URL,
      {
        query: submissionsQuery,
        variables: { username: normalizedUsername },
      },
      {
        headers: {
          "Content-Type": "application/json",
          Referer: `https://leetcode.com/${normalizedUsername}/`,
        },
        timeout: 12000,
      },
    ),
  ]);

  const matchedUser = profileResponse?.data?.data?.matchedUser;
  if (!matchedUser) {
    const error = new Error(
      "LeetCode user not found. Please verify the username.",
    );
    error.statusCode = 404;
    throw error;
  }

  const acStats = matchedUser?.submitStatsGlobal?.acSubmissionNum || [];
  const byDifficulty = acStats.reduce((acc, item) => {
    acc[item.difficulty] = Number(item.count || 0);
    return acc;
  }, {});

  const easySolved = byDifficulty.Easy || 0;
  const mediumSolved = byDifficulty.Medium || 0;
  const hardSolved = byDifficulty.Hard || 0;
  const totalSolved =
    byDifficulty.All || easySolved + mediumSolved + hardSolved;

  const recentSubmissionsRaw =
    submissionsResponse?.data?.data?.recentAcSubmissionList || [];
  const uniqueSlugs = [
    ...new Set(
      recentSubmissionsRaw
        .map((submission) => submission?.titleSlug)
        .filter(Boolean),
    ),
  ];
  const difficultyBySlug = await fetchQuestionDifficulties(uniqueSlugs);
  const recentSubmissions = recentSubmissionsRaw.map((submission) => ({
    title: submission?.title || "Solved problem",
    titleSlug: submission?.titleSlug || "",
    difficulty: difficultyBySlug[submission?.titleSlug] || "Unknown",
    topic: "LeetCode",
    solvedAt: submission?.timestamp
      ? new Date(Number(submission.timestamp) * 1000).toISOString()
      : new Date().toISOString(),
  }));

  return {
    ...buildEmptySnapshot(normalizedUsername),
    totalSolved,
    easySolved,
    mediumSolved,
    hardSolved,
    recentSubmissions,
    contestStats: matchedUser?.profile
      ? [
          {
            ranking: matchedUser.profile.ranking || null,
            reputation: matchedUser.profile.reputation || 0,
            starRating: matchedUser.profile.starRating || 0,
          },
        ]
      : [],
  };
};

const fetchQuestionDifficulties = async (titleSlugs) => {
  if (!Array.isArray(titleSlugs) || titleSlugs.length === 0) {
    return {};
  }

  const fields = titleSlugs
    .map((slug, index) => {
      const safeSlug = String(slug).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
      return `q${index}: question(titleSlug: "${safeSlug}") { titleSlug difficulty }`;
    })
    .join("\n");

  const response = await axios.post(
    LEETCODE_GRAPHQL_URL,
    { query: `query questionDifficulties { ${fields} }` },
    {
      headers: {
        "Content-Type": "application/json",
        Referer: "https://leetcode.com/problemset/",
      },
      timeout: 12000,
    },
  );

  return Object.values(response?.data?.data || {}).reduce((acc, question) => {
    if (question?.titleSlug) {
      acc[question.titleSlug] = question.difficulty || "Unknown";
    }
    return acc;
  }, {});
};

module.exports = {
  fetchLeetcodeSnapshot,
};
