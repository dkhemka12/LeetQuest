const { sendSupportRequestEmail } = require("../services/emailService");

const SUPPORT_EMAIL = "leetquest12@gmail.com";

const getDefaultSubject = (type) =>
  type === "feedback" ? "LeetQuest feedback" : "LeetQuest message";

const createSupportRequest = async (req, res) => {
  try {
    const type = ["message", "feedback"].includes(String(req.body.type))
      ? String(req.body.type)
      : "message";

    const name = String(
      req.body.name || req.user?.firstName || req.user?.username || "",
    ).trim();
    const email = String(req.body.email || req.user?.email || "")
      .trim()
      .toLowerCase();
    const subject = String(req.body.subject || "").trim();
    const body = String(req.body.body || req.body.message || "").trim();
    const category = String(req.body.category || "").trim();
    const ratingValue =
      req.body.rating === undefined ||
      req.body.rating === null ||
      req.body.rating === ""
        ? null
        : Number(req.body.rating);

    if (!name || !email || !body) {
      return res
        .status(400)
        .json({ message: "Name, email, and message are required" });
    }

    if (
      type === "feedback" &&
      ratingValue !== null &&
      (!Number.isInteger(ratingValue) || ratingValue < 1 || ratingValue > 5)
    ) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return res.status(503).json({
        message: "Support email is not configured",
      });
    }

    const supportRequest = {
      type,
      name,
      email,
      subject: subject || getDefaultSubject(type),
      category,
      rating: ratingValue,
      body,
    };

    await sendSupportRequestEmail({
      to: SUPPORT_EMAIL,
      replyTo: email,
      supportRequest,
    });

    res.status(201).json({
      message: type === "feedback" ? "Feedback sent" : "Message sent",
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Server error" });
  }
};

module.exports = {
  createSupportRequest,
};
