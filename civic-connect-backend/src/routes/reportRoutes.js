const express = require("express");
const router = express.Router();
const { createReport, getMyReports } = require("../controllers/reportController");
const { protect } = require("../middleware/authMiddleware");

router.post("/create", protect, createReport);
router.get("/my-reports", protect, getMyReports);

module.exports = router;
