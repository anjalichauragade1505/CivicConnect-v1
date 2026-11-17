const mongoose = require("mongoose");
const User = require("../models/User");
const CITIES = require("./cities");

// Creates the admin account once, using ADMIN_* env variables.
// If the admin already exists, it does nothing.
const seedAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_CITY } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD || !ADMIN_CITY) return;

  const city = CITIES.find(
    (c) => c.toLowerCase() === ADMIN_CITY.trim().toLowerCase()
  );
  if (!city) {
    console.error(`❌ ADMIN_CITY "${ADMIN_CITY}" is invalid. Use one of: ${CITIES.join(", ")}`);
    return;
  }

  const existing = await User.findOne({ email: ADMIN_EMAIL.trim().toLowerCase() });
  if (existing) {
    console.log("ℹ️ Admin already exists, skipping");
    return;
  }

  await User.create({
    name: ADMIN_NAME || "Admin",
    email: ADMIN_EMAIL.trim(),
    password: ADMIN_PASSWORD,
    role: "admin",
    city,
  });
  console.log(`✅ Admin created for ${city}`);
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1);
  }

  try {
    await seedAdmin();
  } catch (err) {
    console.error("❌ Admin seeding error:", err.message);
  }
};

module.exports = connectDB;
