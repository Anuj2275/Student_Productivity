const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  description: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model("Schedule", scheduleSchema);