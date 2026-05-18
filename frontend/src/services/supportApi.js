import api from "./api";

export const submitSupportRequest = async (payload) => {
  try {
    const response = await api.post("/support", payload);
    return response.data;
  } catch (error) {
    console.error("Failed to submit support request:", error);
    throw error;
  }
};
