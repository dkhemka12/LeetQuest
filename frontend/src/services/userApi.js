import api from "./api";

/**
 * Get user profile information
 */
export const getUserProfile = async () => {
  try {
    const response = await api.get("/users/me");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw error;
  }
};

/**
 * Update user profile (username, leetcodeUsername, etc.)
 */
export const updateUserProfile = async (updates) => {
  try {
    const response = await api.put("/users/me", updates);
    return response.data.user || response.data;
  } catch (error) {
    console.error("Failed to update user profile:", error);
    throw error;
  }
};

export const searchUsers = async (query, limit = 10) => {
  try {
    const response = await api.get(
      `/users/search?q=${encodeURIComponent(query)}&limit=${limit}`,
    );
    return response.data.users || [];
  } catch (error) {
    console.error("Failed to search users:", error);
    throw error;
  }
};

export const getUserFriends = async () => {
  try {
    const response = await api.get("/users/me/friends");
    return response.data.friends || [];
  } catch (error) {
    console.error("Failed to fetch user friends:", error);
    throw error;
  }
};

export const addFriend = async (userId) => {
  try {
    const response = await api.post(`/users/me/friends/${userId}`);
    return response.data.friends || [];
  } catch (error) {
    console.error("Failed to add friend:", error);
    throw error;
  }
};

export const removeFriend = async (userId) => {
  try {
    const response = await api.delete(`/users/me/friends/${userId}`);
    return response.data.friends || [];
  } catch (error) {
    console.error("Failed to remove friend:", error);
    throw error;
  }
};

export const getClans = async () => {
  try {
    const response = await api.get("/users/clans");
    return response.data.clans || [];
  } catch (error) {
    console.error("Failed to fetch clans:", error);
    throw error;
  }
};

export const getMyClan = async () => {
  try {
    const response = await api.get("/users/clans/me");
    return response.data.clan || null;
  } catch (error) {
    console.error("Failed to fetch current clan:", error);
    throw error;
  }
};

export const createClan = async (name) => {
  try {
    const response = await api.post("/users/clans", { name });
    return response.data.clan;
  } catch (error) {
    console.error("Failed to create clan:", error);
    throw error;
  }
};

export const joinClan = async (inviteCode) => {
  try {
    const response = await api.post("/users/clans/join", { inviteCode });
    return response.data.clan;
  } catch (error) {
    console.error("Failed to join clan:", error);
    throw error;
  }
};

export const leaveClan = async (clanId) => {
  try {
    const response = await api.post(`/users/clans/${clanId}/leave`);
    return response.data.clan || null;
  } catch (error) {
    console.error("Failed to leave clan:", error);
    throw error;
  }
};

export const getClanTownhall = async (clanId) => {
  try {
    const response = await api.get(`/users/clans/${clanId}/townhall`);
    return response.data.clan || null;
  } catch (error) {
    console.error("Failed to fetch clan townhall:", error);
    throw error;
  }
};

export const postClanTownhallMessage = async (clanId, body) => {
  try {
    const response = await api.post(`/users/clans/${clanId}/townhall`, {
      body,
    });
    return response.data.clan || null;
  } catch (error) {
    console.error("Failed to post clan townhall message:", error);
    throw error;
  }
};

/**
 * Format time to relative format (e.g., "2 hours ago")
 */
export const formatTimeAgo = (date) => {
  if (!date) return "Never";

  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return new Date(date).toLocaleDateString();
};

/**
 * Get user's activity history with pagination
 */
export const getUserActivityHistory = async (page = 1, limit = 20) => {
  try {
    const response = await api.get(
      `/users/me/history?page=${page}&limit=${limit}`,
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch activity history:", error);
    throw error;
  }
};

/**
 * Get public profile of another user
 */
export const getPublicProfile = async (username) => {
  try {
    const response = await api.get(`/users/${username}/public`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch public profile:", error);
    throw error;
  }
};
