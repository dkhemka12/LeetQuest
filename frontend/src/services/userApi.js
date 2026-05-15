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
