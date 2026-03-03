const mongoose = require("mongoose");

const focusSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  sessionType: {
    type: String,
    enum: ["pomodoro", "custom"],
    default: "pomodoro",
  },
  duration: {
    type: Number, 
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  breaksTaken: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("FocusSession", focusSessionSchema);