const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  registerUser,
  loginUser,
  getUserProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const authAttemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many auth attempts. Please try again later.",
  },
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many OTP verification attempts. Please try again later.",
  },
});

const otpResendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many OTP resend requests. Please try again later.",
  },
});

const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 3,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many password reset requests. Please try again later.",
  },
});

router.post("/register", authAttemptLimiter, registerUser);
router.post("/login", authAttemptLimiter, loginUser);
router.post("/verify-otp", otpVerifyLimiter, verifyOTP);
router.post("/resend-otp", otpResendLimiter, resendOTP);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);
router.get("/profile", protect, getUserProfile);

module.exports = router;
