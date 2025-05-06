// src/controllers/businessController.js
const businessService = require("../services/businessService");
const emailService = require("../services/emailService");

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await businessService.getAllBusinesses();
    res.json(businesses);
  } catch (error) {
    console.error("Error fetching businesses:", error);
    res.status(500).json({ message: "Failed to fetch businesses" });
  }
};

exports.getBusinessDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await businessService.getBusinessById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    res.json(business);
  } catch (error) {
    console.error("Error fetching business details:", error);
    res.status(500).json({ message: "Error fetching business details" });
  }
};

exports.suspendBusiness = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await businessService.suspendBusiness(id);

    // Send suspension notification via email service
    await emailService.sendSuspensionNotification(business);

    res.json({ message: "Business suspended successfully" });
  } catch (error) {
    console.error("Error suspending business:", error);
    res.status(500).json({ message: "Error suspending business" });
  }
};

exports.getBusinessStats = async (req, res) => {
  try {
    const { id } = req.params;
    const stats = await businessService.getBusinessStats(id);
    res.json(stats);
  } catch (error) {
    console.error("Error fetching business stats:", error);
    res.status(500).json({ message: "Error fetching business stats" });
  }
};

exports.sendInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const business = await businessService.getBusinessById(id);

    if (!business) {
      return res.status(404).json({ message: "Business not found" });
    }

    // In a real application, you would fetch the latest payment here
    const latestPayment = {
      amount: 0,
      created_at: new Date(),
    };

    await emailService.sendInvoice(business, latestPayment);

    res.json({ message: "Invoice sent successfully" });
  } catch (error) {
    console.error("Error sending invoice:", error);
    res.status(500).json({ message: "Failed to send invoice" });
  }
};
