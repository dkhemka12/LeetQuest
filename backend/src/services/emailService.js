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

const sendSupportRequestEmail = async ({ to, replyTo, supportRequest }) => {
  try {
    const isFeedback = supportRequest.type === "feedback";
    const supportTypeLabel = isFeedback ? "Feedback" : "Message";
    const supportTypeColor = isFeedback ? "#16a34a" : "#f97316";

    const htmlContent = `
      <html>
        <head>
          <style>
            body { margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, Helvetica, sans-serif; color: #111827; }
            .wrapper { width: 100%; padding: 32px 16px; box-sizing: border-box; }
            .container { max-width: 640px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08); border: 1px solid #e5e7eb; }
            .header { background: linear-gradient(135deg, #111827, #1f2937); color: #ffffff; padding: 28px 32px; }
            .eyebrow { margin: 0 0 8px; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #cbd5e1; }
            .title { margin: 0; font-size: 24px; line-height: 1.2; }
            .subtitle { margin: 10px 0 0; font-size: 14px; line-height: 1.6; color: #d1d5db; }
            .body { padding: 28px 32px 8px; }
            .pill { display: inline-block; padding: 6px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; color: #ffffff; background: ${supportTypeColor}; text-transform: uppercase; letter-spacing: 0.08em; }
            .section { margin-top: 22px; padding: 18px 20px; background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 14px; }
            .label { margin: 0 0 6px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #6b7280; }
            .value { margin: 0; font-size: 15px; line-height: 1.6; color: #111827; word-break: break-word; }
            .message { white-space: pre-line; line-height: 1.8; color: #111827; font-size: 15px; }
            .meta-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
            .footer { padding: 0 32px 28px; text-align: center; color: #6b7280; font-size: 12px; line-height: 1.6; }
            @media (min-width: 560px) { .meta-grid { grid-template-columns: 1fr 1fr; } }
          </style>
        </head>
        <body>
          <div class="wrapper">
            <div class="container">
              <div class="header">
                <p class="eyebrow">LeetQuest Support</p>
                <h1 class="title">New ${supportTypeLabel}</h1>
                <p class="subtitle">A user submitted a ${isFeedback ? "feedback response" : "message"} from the public form. Reply directly from this email to continue the conversation.</p>
              </div>

              <div class="body">
                <span class="pill">${supportTypeLabel}</span>

                <div class="section">
                  <div class="meta-grid">
                    <div>
                      <p class="label">From</p>
                      <p class="value">${supportRequest.name}</p>
                    </div>
                    <div>
                      <p class="label">Email</p>
                      <p class="value">${supportRequest.email}</p>
                    </div>
                    <div>
                      <p class="label">Subject</p>
                      <p class="value">${supportRequest.subject || "No subject provided"}</p>
                    </div>
                    <div>
                      <p class="label">Type</p>
                      <p class="value">${supportTypeLabel}</p>
                    </div>
                    ${
                      supportRequest.category
                        ? `
                    <div>
                      <p class="label">Category</p>
                      <p class="value">${supportRequest.category}</p>
                    </div>`
                        : ""
                    }
                    ${
                      supportRequest.rating
                        ? `
                    <div>
                      <p class="label">Rating</p>
                      <p class="value">${supportRequest.rating}/5</p>
                    </div>`
                        : ""
                    }
                  </div>
                </div>

                <div class="section">
                  <p class="label">Message</p>
                  <div class="message">${supportRequest.body}</div>
                </div>
              </div>

              <div class="footer">
                <p>This email was generated automatically from the LeetQuest contact form.</p>
                <p>&copy; 2026 LeetQuest. All rights reserved.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      replyTo: replyTo || supportRequest.email,
      subject: `[LeetQuest] New ${supportRequest.type === "feedback" ? "feedback" : "message"}`,
      html: htmlContent,
    });

    return true;
  } catch (error) {
    console.error("Error sending support request email:", error);
    throw new Error("Failed to send support request email");
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendPasswordResetEmail,
  sendSupportRequestEmail,
};
