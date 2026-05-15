const nodemailer = require("nodemailer");

// Create transporter using Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Gmail App Password (not regular password)
  },
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
            .header { text-align: center; color: #333; }
            .otp-box { background-color: #f0f0f0; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
            .otp-code { font-size: 32px; font-weight: bold; color: #7c3aed; letter-spacing: 5px; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>LeetQuest Email Verification</h1>
            </div>
            <p>Welcome to LeetQuest! To complete your registration, please verify your email with the code below.</p>
            <div class="otp-box">
              <p>Your verification code:</p>
              <div class="otp-code">${otp}</div>
            </div>
            <p>This code will expire in 10 minutes. If you didn't create this account, please ignore this email.</p>
            <div class="footer">
              <p>&copy; 2026 LeetQuest. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your LeetQuest email - OTP",
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  try {
    const htmlContent = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
            .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; }
            .header { text-align: center; color: #333; }
            .button { text-align: center; margin: 20px 0; }
            .reset-button { background-color: #7c3aed; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
            .footer { text-align: center; color: #999; font-size: 12px; margin-top: 20px; }
            .warning { color: #d9534f; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Reset Your LeetQuest Password</h1>
            </div>
            <p>We received a request to reset your password. Click the button below to create a new password.</p>
            <div class="button">
              <a href="${resetLink}" class="reset-button">Reset Password</a>
            </div>
            <p>Or copy this link: <a href="${resetLink}">${resetLink}</a></p>
            <p><span class="warning">This link expires in 1 hour.</span></p>
            <p>If you didn't request a password reset, please ignore this email or contact support.</p>
            <div class="footer">
              <p>&copy; 2026 LeetQuest. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset your LeetQuest password",
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw new Error("Failed to send password reset email");
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
};
