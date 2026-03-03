const express = require("express");
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask
} = require("../controllers/taskController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getTasks);
router.get("/:id", getTask);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;