const express = require("express");
const {
  getSchedules,
  getSchedule,
  createSchedule,
  updateSchedule,
  deleteSchedule
} = require("../controllers/scheduleController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getSchedules);
router.get("/:id", getSchedule);
router.post("/", createSchedule);
router.patch("/:id", updateSchedule);
router.delete("/:id", deleteSchedule);

module.exports = router;