const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const CITIES = require('../config/cities');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  role: {
    type: String,
    enum: ['citizen', 'admin'],
    default: 'citizen'
  },
  // City/area this account belongs to.
  // - For citizens: optional, set automatically from their first report (or chosen at registration).
  // - For admins: REQUIRED — this is what powers city-wise report segregation.
  city: {
    type: String,
    enum: CITIES,
    required: function () {
      return this.role === 'admin';
    }
  }
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Match password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
