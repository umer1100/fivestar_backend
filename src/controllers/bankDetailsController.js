const { BankDetail } = require("../models");

/**
 * Get bank details for the authenticated business
 */
exports.getBankDetails = async (req, res) => {
  try {
    const businessId = req.user.businessId;

    const bankDetails = await BankDetail.findOne({
      where: { business_id: businessId },
      attributes: [
        ["account_holder_name", "accountHolderName"],
        ["transit_number", "transitNumber"],
        ["institution_number", "institutionNumber"],
        ["account_number", "accountNumber"],
        ["bank_name", "bankName"],
        ["account_type", "accountType"],
      ],
    });

    res.json(bankDetails || null);
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ message: "Failed to fetch bank details" });
  }
};

/**
 * Update or create bank details for the authenticated business
 */
exports.updateBankDetails = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    const {
      accountHolderName,
      transitNumber,
      institutionNumber,
      accountNumber,
      bankName,
      accountType,
    } = req.body;

    // Validate input
    if (!/^\d{5}$/.test(transitNumber)) {
      return res
        .status(400)
        .json({ message: "Transit number must be 5 digits" });
    }
    if (!/^\d{3}$/.test(institutionNumber)) {
      return res
        .status(400)
        .json({ message: "Institution number must be 3 digits" });
    }
    if (!/^\d{7,12}$/.test(accountNumber)) {
      return res
        .status(400)
        .json({ message: "Account number must be 7-12 digits" });
    }

    // Use Sequelize's upsert method to either insert or update
    await BankDetail.upsert({
      business_id: businessId,
      account_holder_name: accountHolderName,
      transit_number: transitNumber,
      institution_number: institutionNumber,
      account_number: accountNumber,
      bank_name: bankName,
      account_type: accountType,
      updated_at: new Date(),
    });

    res.json({ message: "Bank details updated successfully" });
  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({ message: "Failed to update bank details" });
  }
};
