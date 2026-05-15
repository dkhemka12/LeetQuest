import api from "./api";
import { mockLoginUser, mockRegisterUser, mockGetProfile } from "./mockAuthApi";

// Toggle to use mock API for development (when backend is down)
const USE_MOCK_API = !import.meta.env.PROD; // Use mock in development

// Wrapper functions that try real API first, fall back to mock
export const registerUser = async (payload) => {
  if (USE_MOCK_API) {
    try {
      return await api.post("/auth/register", payload);
    } catch (error) {
      console.log("Backend unavailable, using mock API for registration");
      return await mockRegisterUser(payload);
    }
  }
  return await api.post("/auth/register", payload);
};

export const loginUser = async (payload) => {
  if (USE_MOCK_API) {
    try {
      return await api.post("/auth/login", payload);
    } catch (error) {
      console.log("Backend unavailable, using mock API for login");
      return await mockLoginUser(payload);
    }
  }
  return await api.post("/auth/login", payload);
};

export const getProfile = async () => {
  if (USE_MOCK_API) {
    try {
      return await api.get("/auth/profile");
    } catch (error) {
      console.log("Backend unavailable, using mock API for profile");
      return await mockGetProfile();
    }
  }
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
