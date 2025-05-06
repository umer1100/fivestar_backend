const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bankDetailsRoutes = require("./routes/bankDetailsRoutes");
// TODO: Import other route files when they are created

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/bank-details", bankDetailsRoutes);
// TODO: Register other routes here

// Basic route for testing
app.get("/", (req, res) => {
  res.json({ message: "Welcome to FiveStar API" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
