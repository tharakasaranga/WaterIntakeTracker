const express = require("express");
const router = express.Router();
const WaterLog = require("../models/WaterLog");

// Get all water logs for a user
router.get("/", async (req, res) => {
  const { clerkId } = req.query;

  if (!clerkId) {
    return res.status(400).json({ error: "clerkId is required" });
  }

  try {
    console.log("[Water Logs] Fetching logs for user:", clerkId);

    const logs = await WaterLog.find({ clerkId }).sort({ date: -1 }).limit(100);

    console.log("[Water Logs] Found logs:", logs.length);
    res.json(logs);
  } catch (err) {
    console.error("[Water Logs] Error fetching logs:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch water logs", details: err.message });
  }
});

// Add water intake
router.post("/", async (req, res) => {
  const { clerkId, amount, notes } = req.body;

  if (!clerkId || !amount) {
    return res.status(400).json({ error: "clerkId and amount are required" });
  }

  try {
    console.log("[Water Logs] Adding water intake:", {
      clerkId,
      amount,
      notes,
    });

    const waterLog = new WaterLog({
      clerkId,
      amount: parseInt(amount),
      notes: notes || "",
      date: new Date(),
    });

    await waterLog.save();

    console.log("[Water Logs] Water intake saved:", waterLog);
    res.json(waterLog);
  } catch (err) {
    console.error("[Water Logs] Error adding water:", err);
    res
      .status(500)
      .json({ error: "Failed to add water intake", details: err.message });
  }
});

// Get water logs for a specific date
router.get("/date/:date", async (req, res) => {
  const { date } = req.params;
  const { clerkId } = req.query;

  if (!clerkId) {
    return res.status(400).json({ error: "clerkId is required" });
  }

  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    console.log("[Water Logs] Fetching logs for date:", { clerkId, date });

    const logs = await WaterLog.find({
      clerkId,
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });

    const totalIntake = logs.reduce((sum, log) => sum + log.amount, 0);

    res.json({ date, logs, totalIntake });
  } catch (err) {
    console.error("[Water Logs] Error fetching date logs:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch water logs", details: err.message });
  }
});

// Delete a water log entry
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    console.log("[Water Logs] Deleting log:", id);

    const result = await WaterLog.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ error: "Water log not found" });
    }

    console.log("[Water Logs] Log deleted successfully");
    res.json({ success: true, message: "Water log deleted" });
  } catch (err) {
    console.error("[Water Logs] Error deleting log:", err);
    res
      .status(500)
      .json({ error: "Failed to delete water log", details: err.message });
  }
});

module.exports = router;
