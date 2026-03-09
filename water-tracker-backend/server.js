require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

// Database Connect
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Backend is running",
    timestamp: new Date(),
  });
});

// Routes - මෙතනදී ෆයිල් එක හරියටම path එකට තිබේදැයි බලන්න
const userRouter = require("./routes/userRoutes");
const waterRouter = require("./routes/waterRoutes");
const notificationRouter = require("./routes/notificationRoutes");

app.use("/api/users", userRouter);
app.use("/api/water-logs", waterRouter);
app.use("/api", notificationRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT} 🚀`));
