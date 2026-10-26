const mongoose = require("mongoose");
const Report = require("../models/Report");

// Admin: get all reports for the admin's own city ONLY (city-wise segregation)
exports.getReportsByCity = async (req, res) => {
  try {
    const adminCity = req.user.city;

    if (!adminCity) {
      return res.status(400).json({
        message: "Your admin account has no city assigned. Please contact a super admin."
      });
    }

    const reports = await Report.find({ city: adminCity })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error fetching reports by city:", error.message);
    res.status(500).json({ message: "Failed to fetch reports" });
  }
};

// Admin: update report status — restricted to admin's own city
exports.updateReportStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = Report.STATUSES;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: `Status must be one of: ${allowedStatuses.join(", ")}`
      });
    }

    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    // Prevent an admin from updating a report outside their own city
    if (report.city !== req.user.city) {
      return res.status(403).json({ message: "You can only manage reports in your own city" });
    }

    report.status = status;
    await report.save();

    res.status(200).json({ message: "Status updated successfully", report });
  } catch (error) {
    console.error("Error updating report:", error.message);
    res.status(500).json({ message: "Failed to update report status" });
  }
};

// Admin: get single report — restricted to admin's own city
exports.getSingleReport = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid report ID" });
    }

    const report = await Report.findById(req.params.id).populate("user", "name email phone");
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    if (report.city !== req.user.city) {
      return res.status(403).json({ message: "You can only view reports in your own city" });
    }

    res.status(200).json(report);
  } catch (error) {
    console.error("Error in getSingleReport:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
