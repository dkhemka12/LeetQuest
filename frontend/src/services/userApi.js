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
