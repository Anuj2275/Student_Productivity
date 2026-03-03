const mongoose = require("mongoose");

const focusPreferenceSchema = new mongoose.Schema({
  pomodoroMinutes: { type: Number, default: 25 },
  shortBreakMinutes: { type: Number, default: 5 },
  longBreakMinutes: { type: Number, default: 10 },
});

const notificationSettingsSchema = new mongoose.Schema({
  fixedReminders: { type: Boolean, default: true },
  smartReminders: { type: Boolean, default: true },
  motivationalNudges: { type: Boolean, default: true },
  quietHoursStart: { type: String, default: null },
  quietHoursEnd: { type: String, default: null },
});

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    avatar: { type: String },

    authMethods: {
      type: [String],
      enum: ["google", "password"],
      default: ["password"],
    },

    languagePreference: {
      type: String,
      default: "en",
    },

    focusStylePreference: {
      type: focusPreferenceSchema,
      default: () => ({}),
    },

    notificationSettings: {
      type: notificationSettingsSchema,
      default: () => ({}),
    },

    aiContextSharing: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);