const express = require("express");
const router = express.Router();

const {
  syncLeetcodeData,
  getLeetcodeStatus,
} = require("../controllers/leetcodeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/status", protect, getLeetcodeStatus);
router.post("/sync", protect, syncLeetcodeData);

module.exports = router;
