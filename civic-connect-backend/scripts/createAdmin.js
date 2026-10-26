// Usage:
//   node scripts/createAdmin.js "Admin Name" admin@example.com "StrongPass123!" Nagpur
//
// Creates one admin account for a given city. Run once per city you want
// to staff with an admin (e.g. once for Nagpur, once for Pune, etc.)

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../src/models/User");
const CITIES = require("../src/config/cities");

const [name, email, password, city] = process.argv.slice(2);

if (!name || !email || !password || !city) {
  console.error("❌ Usage: node scripts/createAdmin.js \"Name\" email password City");
  console.error(`   Valid cities: ${CITIES.join(", ")}`);
  process.exit(1);
}

if (!CITIES.includes(city)) {
  console.error(`❌ "${city}" is not a valid city. Valid cities: ${CITIES.join(", ")}`);
  process.exit(1);
}

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.error(`❌ A user with email ${email} already exists`);
      process.exit(1);
    }

    await User.create({
      name,
      email,
      password, // hashed automatically by the User model's pre-save hook
      role: "admin",
      city
    });

    console.log(`✅ Admin created successfully for ${city}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("❌ Error creating admin:", err.message);
    process.exit(1);
  });
