const mongoose = require("mongoose");
const CITIES = require("../config/cities");

// Single source of truth for report status values.
// Frontend dropdowns/tabs MUST use these exact strings.
const STATUSES = ["Pending", "In Progress", "Resolved", "Rejected"];

const reportSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: { type: String, required: true, trim: true },
  description: String,
  image: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: STATUSES,
    default: "Pending"
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String
  },
  landmark: {
    type: String
  },
  // City the report belongs to — this is what admins are filtered by.
  city: {
    type: String,
    enum: CITIES,
    required: true
  }
}, { timestamps: true });

reportSchema.statics.STATUSES = STATUSES;

module.exports = mongoose.model("Report", reportSchema);
