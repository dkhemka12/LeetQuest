const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const {
  getAllUsers,
  getUserDetails,
  deleteUser,
  banUser,
  unbanUser,
  updateUser,
  getUserActivity,
  getAdminStats,
} = require("../controllers/adminController");

// All admin routes require authentication and admin role
router.use(protect);
router.use(adminMiddleware);

// Admin dashboard stats
router.get("/stats", getAdminStats);

// User management
router.get("/users", getAllUsers);
router.get("/users/:userId", getUserDetails);
router.patch("/users/:userId", updateUser);
router.delete("/users/:userId", deleteUser);

// User banning
router.post("/users/:userId/ban", banUser);
router.post("/users/:userId/unban", unbanUser);

// Activity logs
router.get("/users/:userId/activity", getUserActivity);

module.exports = router;
