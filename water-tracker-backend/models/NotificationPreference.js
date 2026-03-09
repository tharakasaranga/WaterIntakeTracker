const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reminderFrequency: {
      type: Number,
      default: 120, // minutes
      min: 60,
      max: 240,
    },
    reminderStartTime: {
      type: String,
      default: "08:00", // HH:mm format
    },
    reminderEndTime: {
      type: String,
      default: "22:00",
    },
    enabled: {
      type: Boolean,
      default: true,
    },
    lastReminderSent: {
      type: Date,
      default: null,
    },
    muteUntil: {
      type: Date,
      default: null, // For snooze functionality
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model(
  "NotificationPreference",
  notificationPreferenceSchema,
);
