// src/services/businessService.js
const {
  Business,
  Subscription,
  Referral,
  ReferralEarning,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.getAllBusinesses = async () => {
  return Business.findAll({
    attributes: ["id", "business_name", "owner_name", "email", "created_at"],
    include: [
      {
        model: Subscription,
        attributes: ["status"],
        required: false,
      },
    ],
    where: {
      is_admin: false,
    },
    order: [["created_at", "DESC"]],
  });
};

exports.getBusinessById = async (id) => {
  return Business.findByPk(id, {
    include: [
      {
        model: Subscription,
        attributes: ["status", "current_period_end"],
        required: false,
      },
      {
        model: Referral,
        as: "referrals",
        required: false,
      },
    ],
  });
};

exports.suspendBusiness = async (id) => {
  const transaction = await sequelize.transaction();

  try {
    // Update subscription status
    await Subscription.update(
      {
        status: "suspended",
        updated_at: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      {
        where: { business_id: id },
        transaction,
      }
    );

    // Get business email for notification
    const business = await Business.findByPk(id, {
      attributes: ["email", "business_name"],
      transaction,
    });

    await transaction.commit();
    return business;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

exports.getBusinessStats = async (id) => {
  // Using Sequelize aggregations instead of raw SQL
  const stats = await Business.findByPk(id, {
    attributes: [
      [
        sequelize.fn(
          "COALESCE",
          sequelize.fn(
            "SUM",
            sequelize.col("referrerReferrals.earnings.amount")
          ),
          0
        ),
        "total_earnings",
      ],
      [
        sequelize.fn(
          "COALESCE",
          sequelize.fn(
            "SUM",
            sequelize.literal(
              'CASE WHEN "referrerReferrals->earnings".status = \'pending\' THEN "referrerReferrals->earnings".amount ELSE 0 END'
            )
          ),
          0
        ),
        "pending_payments",
      ],
      [
        sequelize.fn(
          "COUNT",
          sequelize.fn("DISTINCT", sequelize.col("referrerReferrals.id"))
        ),
        "successful_referrals",
      ],
      [
        sequelize.literal(`
          ROUND(
            CAST(COUNT(DISTINCT CASE WHEN "referrerReferrals->referredBusiness->Subscription".status = 'active' THEN "referrerReferrals".id END) AS DECIMAL) / 
            NULLIF(COUNT(DISTINCT "referrerReferrals".id), 0) * 100,
            1
          )
        `),
        "conversion_rate",
      ],
    ],
    include: [
      {
        model: Referral,
        as: "referrerReferrals",
        required: false,
        include: [
          {
            model: ReferralEarning,
            as: "earnings",
            required: false,
          },
          {
            model: Business,
            as: "referredBusiness",
            required: false,
            include: [
              {
                model: Subscription,
                required: false,
              },
            ],
          },
        ],
      },
    ],
    group: ["Business.id"],
  });

  return (
    stats || {
      total_earnings: 0,
      pending_payments: 0,
      successful_referrals: 0,
      conversion_rate: 0,
    }
  );
};
