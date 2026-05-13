import api from "./api";

export const getDashboardSummary = () => api.get("/dashboard/summary");
export const getAnalyticsOverview = () => api.get("/dashboard/analytics");
