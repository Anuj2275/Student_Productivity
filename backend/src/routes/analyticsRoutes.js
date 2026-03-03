const express = require("express");
const { getAnalytics } = require("../controllers/analyticsController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

// Example: /api/analytics?period=daily
router.get("/", getAnalytics);

module.exports = router;