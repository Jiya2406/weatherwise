require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const weatherRoutes = require("./routes/weatherRoutes");
const historyRoutes = require("./routes/historyRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB (non-blocking — app still serves weather if DB is down)
connectDB();

// --- Middleware ---------------------------------------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);
app.use(express.json());

// --- Routes -------------------------------------------------------------
app.get("/", (req, res) => {
  res.json({ message: "WeatherWise API is running 🌦️" });
});

app.use("/api/weather", weatherRoutes);
app.use("/api/history", historyRoutes);

// --- Error handling -----------------------------------------------------
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

module.exports = app;
