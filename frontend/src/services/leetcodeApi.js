import api from "./api";

export const getLeetcodeStatus = () => api.get("/leetcode/status");
export const syncLeetcodeData = (payload) =>
  api.post("/leetcode/sync", payload);
