// src/controllers/financeController.js
const financeService = require("../services/financeService");

exports.getFinancialOverview = async (req, res) => {
  try {
    const overview = await financeService.getFinancialOverview();
    res.json(overview);
  } catch (error) {
    console.error("Error fetching financial overview:", error);
    res.status(500).json({ message: "Error fetching financial overview" });
  }
};

exports.getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const report = await financeService.getRevenueReport(startDate, endDate);
    res.json(report);
  } catch (error) {
    console.error("Error fetching revenue report:", error);
    res.status(500).json({ message: "Error fetching revenue report" });
  }
};

exports.getCommissionsReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required" });
    }

    const report = await financeService.getCommissionsReport(
      startDate,
      endDate
    );
    res.json(report);
  } catch (error) {
    console.error("Error fetching commissions report:", error);
    res.status(500).json({ message: "Error fetching commissions report" });
  }
};
