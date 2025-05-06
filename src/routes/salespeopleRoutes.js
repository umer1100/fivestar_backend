// src/routes/salespeopleRoutes.js
const express = require("express");
const router = express.Router();
const salespeopleController = require("../controllers/salespeopleController");
const auth = require("../middleware/auth");

// Get all salespeople
router.get("/", auth, salespeopleController.getSalespeople);

// Get salesperson details
router.get("/:id", auth, salespeopleController.getSalespersonDetail);

// Get salesperson referrals
router.get(
  "/:id/referrals",
  auth,
  salespeopleController.getSalespersonReferrals
);

// Get salesperson payments
router.get("/:id/payments", auth, salespeopleController.getSalespersonPayments);

module.exports = router;
