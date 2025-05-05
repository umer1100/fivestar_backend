const express = require("express");
const router = express.Router();
const bankDetailsController = require("../controllers/bankDetailsController");
const auth = require("../middleware/auth");

// Get bank details for authenticated business
router.get("/", auth, bankDetailsController.getBankDetails);

// Update bank details for authenticated business
router.post("/", auth, bankDetailsController.updateBankDetails);

module.exports = router;
