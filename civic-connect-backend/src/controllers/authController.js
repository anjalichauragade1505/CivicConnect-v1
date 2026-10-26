const User = require('../models/User');
const jwt = require('jsonwebtoken');
const CITIES = require('../config/cities');

// Token generator with role baked in
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  city: user.city
});

// Register user (citizens only via this endpoint — admins are created separately)
exports.register = async (req, res) => {
  const { name, email, password, phone, city } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists' });
    }

    if (city && !CITIES.includes(city)) {
      return res.status(400).json({ message: 'Please select a valid city' });
    }

    // Enforce citizen role only — admins cannot self-register
    const user = new User({ name, email, password, phone, city, role: 'citizen' });
    await user.save();

    const token = generateToken(user);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    console.error("Register Error:", error.message);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user with role restriction
exports.login = async (req, res) => {
  const { email, password, loginAs } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!loginAs || !['citizen', 'admin'].includes(loginAs)) {
      return res.status(400).json({ message: 'Invalid login role' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Prevent role mismatch login (citizen trying admin tab, or vice versa)
    if (user.role !== loginAs) {
      return res.status(403).json({
        message: `Access denied: please login as a ${user.role}`,
      });
    }

    const token = generateToken(user);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).json({ message: 'Server error during login' });
  }
};
