const Schedule = require("../models/Schedule");

exports.getSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find({ userId: req.userId }).sort({ startTime: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOne({ _id: req.params.id, userId: req.userId });
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.create({
      ...req.body,
      userId: req.userId
    });
    res.status(201).json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSchedule = async (req, res) => {
  try {
    const schedule = await Schedule.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!schedule) return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSchedule = async (req, res) => {
  try {
    await Schedule.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: "Schedule deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};