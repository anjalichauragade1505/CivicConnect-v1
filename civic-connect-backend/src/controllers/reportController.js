const Report = require("../models/Report");
const CITIES = require("../config/cities");

// Citizen creates a report
exports.createReport = async (req, res) => {
  try {
    const { title, description, image, location, landmark, category, city } = req.body;

    if (!image) {
      return res.status(400).json({ message: "Please attach a photo of the issue" });
    }
    if (!title || !category || !location) {
      return res.status(400).json({ message: "Title, category and location are required" });
    }
    if (!city || !CITIES.includes(city)) {
      return res.status(400).json({ message: "Please select a valid city" });
    }

    const report = await Report.create({
      user: req.user._id,
      title,
      description,
      image,
      location,
      landmark,
      category,
      city,
      status: "Pending"
    });

    res.status(201).json({ message: "Report submitted successfully", report });
  } catch (error) {
    console.error("Create Report Error:", error.message);
    res.status(500).json({ message: "Server error while creating report" });
  }
};

// Fetch all reports created by the logged-in citizen
exports.getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (error) {
    console.error("Get My Reports Error:", error.message);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};
