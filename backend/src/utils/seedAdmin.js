const User = require("../models/User");
const bcryptjs = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return;
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      if (!adminExists.isAdmin) {
        // Upgrade to admin if not already
        adminExists.isAdmin = true;
      }
      adminExists.password = await bcryptjs.hash(adminPassword, 10);
      adminExists.emailVerified = true;
      await adminExists.save();
      return;
    }

    // Create admin user
    const hashedPassword = await bcryptjs.hash(adminPassword, 10);
    const adminUser = new User({
      username: "devansh",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      emailVerified: true,
      xp: 0,
      level: 1,
    });

    await adminUser.save();
  } catch (err) {
    console.error("Admin seeding error:", err.message);
  }
};

module.exports = seedAdmin;
