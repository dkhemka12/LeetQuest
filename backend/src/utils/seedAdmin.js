const User = require("../models/User");
const bcryptjs = require("bcryptjs");

const seedAdmin = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.log("ADMIN_EMAIL not set in .env - skipping admin seeding");
      return;
    }

    // Check if admin already exists
    const adminExists = await User.findOne({ email: adminEmail });
    if (adminExists) {
      if (!adminExists.isAdmin) {
        // Upgrade to admin if not already
        adminExists.isAdmin = true;
        await adminExists.save();
        console.log(`✓ Admin privileges granted to ${adminEmail}`);
      }
      return;
    }

    // Create admin user
    const hashedPassword = await bcryptjs.hash("admin123", 10);
    const adminUser = new User({
      username: "admin",
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      xp: 0,
      level: 1,
    });

    await adminUser.save();
    console.log(`✓ Admin user created: ${adminEmail}`);
    console.log(`  Password: admin123 (CHANGE THIS IN PRODUCTION!)`);
  } catch (err) {
    console.error("Admin seeding error:", err.message);
  }
};

module.exports = seedAdmin;
