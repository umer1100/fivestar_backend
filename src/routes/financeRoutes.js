// src/routes/financeRoutes.js
const express = require("express");
const router = express.Router();
const financeController = require("../controllers/financeController");
const auth = require("../middleware/auth");

// Get financial overview
router.get("/overview", auth, financeController.getFinancialOverview);

// Get revenue report
router.get("/revenue", auth, financeController.getRevenueReport);

// Get commissions report
router.get("/commissions", auth, financeController.getCommissionsReport);

module.exports = router;
