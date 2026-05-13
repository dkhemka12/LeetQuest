import api from "./api";

// Get admin dashboard stats
export const getAdminStats = () => api.get("/admin/stats");

// Get all users
export const getAllUsers = (page = 1, limit = 20, search = "") =>
  api.get("/admin/users", {
    params: { page, limit, search },
  });

// Get user details
export const getUserDetails = (userId) => api.get(`/admin/users/${userId}`);

// Update user
export const updateUser = (userId, data) =>
  api.patch(`/admin/users/${userId}`, data);

// Delete user
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}`);

// Ban user
export const banUser = (userId, reason = "") =>
  api.post(`/admin/users/${userId}/ban`, { reason });

// Unban user
export const unbanUser = (userId) => api.post(`/admin/users/${userId}/unban`);

// Get user activity logs
export const getUserActivity = (userId, limit = 50) =>
  api.get(`/admin/users/${userId}/activity`, {
    params: { limit },
  });
