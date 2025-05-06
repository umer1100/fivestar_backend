// src/routes/businessRoutes.js
const express = require("express");
const router = express.Router();
const businessController = require("../controllers/businessController");
const auth = require("../middleware/auth");

// Get all businesses (admin only)
router.get("/", auth, businessController.getBusinesses);

// Get business details
router.get("/:id", auth, businessController.getBusinessDetail);

// Suspend a business (admin only)
router.post("/:id/suspend", auth, businessController.suspendBusiness);

// Get business stats
router.get("/:id/stats", auth, businessController.getBusinessStats);

// Send invoice to business
router.post("/:id/send-invoice", auth, businessController.sendInvoice);

module.exports = router;
