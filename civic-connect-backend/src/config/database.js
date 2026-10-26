const mongoose = require("mongoose");

// Creates the admin account automatically on startup if ADMIN_EMAIL +
// ADMIN_PASSWORD are set and that admin does not exist yet.
const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_CITY } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) return;
  const User = require("../models/User");
  const exists = await User.findOne({ email: ADMIN_EMAIL.toLowerCase() });
  if (exists) return;
  await User.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
    city: ADMIN_CITY || "Nagpur",
  });
  console.log("✅ Admin account created:", ADMIN_EMAIL);
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
    await seedAdmin();
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
