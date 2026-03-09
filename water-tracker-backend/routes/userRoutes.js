const express = require("express");
const router = express.Router();
const User = require("../models/User");

// 1. User කෙනෙක්ව පරීක්ෂා කිරීම හෝ අලුතින් සෑදීම
router.post("/sync", async (req, res) => {
  const { clerkId, email, name } = req.body;

  console.log("[Backend Sync] Received request:", { clerkId, email, name });

  try {
    let user = await User.findOne({ clerkId });

    if (!user) {
      console.log("[Backend Sync] New user, creating...");
      // අලුත් User කෙනෙක් නම් Register කරනවා
      user = new User({
        clerkId,
        email,
        name,
        isSetupComplete: false,
      });
      await user.save();
      console.log("[Backend Sync] User created:", user);
    } else {
      console.log("[Backend Sync] Existing user found:", user);
    }

    res.json(user);
  } catch (err) {
    console.error("[Backend Sync] Error:", err);
    res.status(500).json({ error: "Server Error", details: err.message });
  }
});

// 2. Profile Setup (බර ඇතුළත් කර Daily Goal සෑදීම)
router.post("/setup", async (req, res) => {
  const { clerkId, weight } = req.body;

  try {
    // Daily Goal සූත්‍රය: බර (kg) * 35ml
    const calculatedGoal = weight * 35;

    const user = await User.findOneAndUpdate(
      { clerkId },
      {
        weight,
        dailyGoal: calculatedGoal,
        isSetupComplete: true,
      },
      { new: true },
    );

    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// අනිවාර්යයෙන්ම මෙය අවසානයට තිබිය යුතුයි
module.exports = router;
