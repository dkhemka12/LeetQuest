import api from "./api";
export const registerUser = async (payload) => {
  return await api.post("/auth/register", payload);
};

export const loginUser = async (payload) => {
  return await api.post("/auth/login", payload);
};

export const getProfile = async () => {
  return await api.get("/auth/profile");
};

export const verifyOTP = async (userId, otp) => {
  return await api.post("/auth/verify-otp", { userId, otp });
};

export const resendOTP = async (email) => {
  return await api.post("/auth/resend-otp", { email });
};

export const forgotPassword = async (email) => {
  return await api.post("/auth/forgot-password", { email });
};

export const resetPassword = async (resetToken, newPassword) => {
  return await api.post("/auth/reset-password", {
    resetToken,
    newPassword,
  });
};
