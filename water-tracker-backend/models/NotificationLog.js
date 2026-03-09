const mongoose = require("mongoose");

const notificationLogSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["reminder", "achievement", "quick_add", "snooze"],
      default: "reminder",
    },
    title: String,
    body: String,
    sent_at: {
      type: Date,
      default: Date.now,
      index: true,
    },
    user_action: {
      type: String,
      enum: ["tapped", "dismissed", "action_taken", "snooze", "none"],
      default: "none",
    },
    action_details: {
      amount: Number, // if quick add was tapped
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("NotificationLog", notificationLogSchema);
