const express = require("express");
const router = express.Router();

const {
  getDashboardSummary,
  getAnalyticsOverview,
} = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

router.get("/summary", protect, getDashboardSummary);
router.get("/analytics", protect, getAnalyticsOverview);

module.exports = router;
