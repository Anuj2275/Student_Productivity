const FocusSession = require("../models/FocusSession");
const Task = require("../models/Task");

const getRange = (period) => {
  const now = new Date();
  switch (period) {
    case "daily":
      return [
        new Date(now.setHours(0, 0, 0, 0)),
        new Date(now.setHours(23, 59, 59, 999)),
      ];
    case "weekly":
      const first = now.getDate() - now.getDay()
      return [
        new Date(now.setDate(first)),
        new Date(now.setDate(first + 6)),
      ];
    case "monthly":
      return [
        new Date(now.getFullYear(), now.getMonth(), 1),
        new Date(now.getFullYear(), now.getMonth() + 1, 0),
      ];
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { period } = req.query;
    const [start, end] = getRange(period);

    const sessions = await FocusSession.find({
      userId: req.userId,
      startTime: { $gte: start, $lte: end },
    });

    const tasks = await Task.find({
      userId: req.userId,
      updatedAt: { $gte: start, $lte: end },
      completed: true,
    });

    const totalFocusTime = sessions.reduce((sum, s) => sum + s.duration, 0);

    res.json({
      period,
      totalFocusTime,
      totalSessions: sessions.length,
      completedTasks: tasks.length,
      sessions,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};