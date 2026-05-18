const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const leetcodeRoutes = require("./routes/leetcodeRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const challengeRoutes = require("./routes/challengeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const supportRoutes = require("./routes/supportRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "LeetQuest API running" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/leetcode", leetcodeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/challenges", challengeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/support", supportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: error.message || "Server error",
  });
});

module.exports = app;
