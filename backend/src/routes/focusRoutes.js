const express = require("express");
const {
  getSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
} = require("../controllers/focusController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();
router.use(authMiddleware);

router.get("/", getSessions);
router.get("/:id", getSession);
router.post("/", createSession);
router.patch("/:id", updateSession);
router.delete("/:id", deleteSession);

module.exports = router;
