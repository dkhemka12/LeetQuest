const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");
const { logActivity } = require("../services/activityService");
const {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
} = require("../services/emailService");
const crypto = require("crypto");

const buildAuthResponse = (user) => ({
  _id: user._id,
  username: user.username,
  email: user.email,
  firstName: user.firstName || "",
  lastName: user.lastName || "",
  leetcodeUsername: user.leetcodeUsername,
  isAdmin: user.isAdmin,
  profileComplete: Boolean(user.firstName && user.lastName),
  token: generateToken(user._id),
});

// @desc    Register a new user (step 1: create user with OTP)
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { username, email, password, leetcodeUsername, firstName, lastName } =
      req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }] });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      firstName: firstName || "",
      lastName: lastName || "",
      leetcodeUsername: leetcodeUsername || "",
      otpCode: otp,
      otpExpiry: otpExpiry,
      emailVerified: false,
    });

    if (user) {
      // Send OTP email
      try {
        await sendOTPEmail(email, otp);
      } catch (emailErr) {
        console.error(
          "⚠️ OTP Email failed - check Gmail credentials:",
          emailErr.message,
        );
      }

      res.status(201).json({
        message: "User registered. Please verify your email with the OTP sent.",
        userId: user._id,
        email: user.email,
        requiresVerification: true,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.emailVerified) {
        return res.status(403).json({
          message: "Please verify your email before logging in",
          requiresVerification: true,
          email: user.email,
          userId: user._id,
        });
      }

      // Check if user is banned
      if (user.isBanned) {
        return res.status(403).json({
          message: "Your account has been banned",
          reason: user.bannedReason || "No reason provided",
        });
      }

      // Non-blocking activity logging for analytics timeline.
      await logActivity({
        userId: user._id,
        title: "Logged in",
        topic: "Auth",
        difficulty: "Easy",
      }).catch(() => null);

      res.json({
        ...buildAuthResponse(user),
        emailVerified: user.emailVerified,
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        isAdmin: user.isAdmin,
        isBanned: user.isBanned,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        leetcodeUsername: user.leetcodeUsername,
        badges: user.badges,
        friends: user.friends,
        profileComplete: Boolean(user.firstName && user.lastName),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Verify OTP and activate email
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Check if OTP is expired
    if (!user.otpExpiry || new Date() > user.otpExpiry) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Check if OTP matches
    if (user.otpCode !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark email as verified and clear OTP
    user.emailVerified = true;
    user.otpCode = null;
    user.otpExpiry = null;
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      title: "Verified email",
      topic: "Auth",
      difficulty: "Easy",
    }).catch(() => null);

    // Log in the user
    res.status(200).json({
      message: "Email verified successfully",
      ...buildAuthResponse(user),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.emailVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user.otpCode = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp).catch((err) => {
      console.error("Failed to send OTP:", err);
    });

    res.status(200).json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Request password reset
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate password reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpiry = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

    user.passwordResetToken = resetToken;
    user.passwordResetExpiry = resetExpiry;
    await user.save();

    // Create reset link.
    const frontendBaseUrl = process.env.FRONTEND_URL;

    if (!frontendBaseUrl) {
      return res.status(500).json({
        message: "FRONTEND_URL is not configured",
      });
    }

    const resetLink = `${frontendBaseUrl.replace(/\/$/, "")}/reset-password/${resetToken}`;

    // Send the email before responding so deployment runtimes do not drop it.
    await sendPasswordResetEmail(email, resetToken, resetLink);

    res.status(200).json({
      message: "Password reset link sent to your email",
    });
  } catch (error) {
    console.error("Forgot password failed:", error);

    const isEmailDeliveryFailure =
      error.message?.includes("Email service is not configured") ||
      error.message?.includes("Failed to send password reset email") ||
      error.code === "EAUTH" ||
      error.code === "ECONNECTION" ||
      error.code === "ETIMEDOUT";

    if (isEmailDeliveryFailure) {
      return res.status(502).json({
        message:
          "Password reset email could not be sent from the deployed server. Check EMAIL_USER, EMAIL_PASSWORD, and outbound SMTP access.",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res
        .status(400)
        .json({ message: "Reset token and new password are required" });
    }

    const user = await User.findOne({
      passwordResetToken: resetToken,
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid reset token" });
    }

    // Check if reset token is expired
    if (!user.passwordResetExpiry || new Date() > user.passwordResetExpiry) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.passwordResetToken = null;
    user.passwordResetExpiry = null;
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      title: "Reset password",
      topic: "Auth",
      difficulty: "Easy",
    }).catch(() => null);

    res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  verifyOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
};
