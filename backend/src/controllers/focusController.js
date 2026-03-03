const FocusSession = require("../models/FocusSession");

exports.getSessions = async (req, res) => {
  try {
    const sessions = await FocusSession.find({ userId: req.userId })
      .sort({ startTime: -1 });
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getSession = async (req, res) => {
  try {
    const session = await FocusSession.findOne({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    if (!session) 
      return res.status(404).json({ message: "Session not found" });

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.createSession = async (req, res) => {
  try {
    const session = await FocusSession.create({
      ...req.body,
      userId: req.userId,
    });
    res.status(201).json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await FocusSession.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!session)
      return res.status(404).json({ message: "Session not found" });

    res.json(session);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    await FocusSession.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });
    res.json({ message: "Session deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};