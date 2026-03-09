const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  clerkId: { type: String, required: true, unique: true },
  name: String,
  email: String,
  weight: { type: Number, default: 0 },
  dailyGoal: { type: Number, default: 2500 }, // මිලිලීටර් වලින්
  isSetupComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', UserSchema);