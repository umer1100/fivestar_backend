// src/controllers/salespeopleController.js
const salespeopleService = require("../services/salespeopleService");

exports.getSalespeople = async (req, res) => {
  try {
    const salespeople = await salespeopleService.getAllSalespeople();
    res.json(salespeople);
  } catch (error) {
    console.error("Error fetching salespeople:", error);
    res.status(500).json({ message: "Error fetching salespeople" });
  }
};

exports.getSalespersonDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const salesperson = await salespeopleService.getSalespersonById(id);

    if (!salesperson) {
      return res.status(404).json({ message: "Salesperson not found" });
    }

    res.json(salesperson);
  } catch (error) {
    console.error("Error fetching salesperson details:", error);
    res.status(500).json({ message: "Error fetching salesperson details" });
  }
};

exports.getSalespersonReferrals = async (req, res) => {
  try {
    const { id } = req.params;
    const referrals = await salespeopleService.getSalespersonReferrals(id);
    res.json(referrals);
  } catch (error) {
    console.error("Error fetching salesperson referrals:", error);
    res.status(500).json({ message: "Error fetching salesperson referrals" });
  }
};

exports.getSalespersonPayments = async (req, res) => {
  try {
    const { id } = req.params;
    const payments = await salespeopleService.getSalespersonPayments(id);
    res.json(payments);
  } catch (error) {
    console.error("Error fetching salesperson payments:", error);
    res.status(500).json({ message: "Error fetching salesperson payments" });
  }
};
