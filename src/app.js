// src/app.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bankDetailsRoutes = require("./routes/bankDetailsRoutes");
const businessRoutes = require("./routes/businessRoutes");
const salespeopleRoutes = require("./routes/salespeopleRoutes");
const financeRoutes = require("./routes/financeRoutes");

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
app.use("/api/businesses", businessRoutes);
app.use("/api/salespeople", salespeopleRoutes);
app.use("/api/finances", financeRoutes);

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
