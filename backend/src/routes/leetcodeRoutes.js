const express = require("express");
const router = express.Router();

const {
  syncLeetcodeData,
  getLeetcodeStatus,
  clearAndResyncLeetcode,
} = require("../controllers/leetcodeController");
const { protect } = require("../middleware/authMiddleware");

router.get("/status", protect, getLeetcodeStatus);
router.post("/sync", protect, syncLeetcodeData);
router.post("/clear-and-resync", protect, clearAndResyncLeetcode);

module.exports = router;
