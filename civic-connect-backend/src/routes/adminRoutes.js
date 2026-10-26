const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/adminMiddleware");
const {
  getReportsByCity,
  updateReportStatus,
  getSingleReport,
} = require("../controllers/adminController");

router.get("/reports", protect, isAdmin, getReportsByCity);
router.get("/reports/:id", protect, isAdmin, getSingleReport);
router.put("/reports/:id/status", protect, isAdmin, updateReportStatus);

module.exports = router;
