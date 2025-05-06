// src/services/salespeopleService.js
const {
  Business,
  Referral,
  ReferralEarning,
  Subscription,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.getAllSalespeople = async () => {
  return Business.findAll({
    attributes: [
      "id",
      "business_name",
      [
        sequelize.literal(`(
          SELECT COUNT(DISTINCT r.id) 
          FROM referrals r 
          WHERE r.referrer_id = "Business".id
        )`),
        "total_referrals",
      ],
      [
        sequelize.literal(`(
          SELECT COUNT(DISTINCT r.id) 
          FROM referrals r 
          JOIN subscriptions s ON s.business_id = r.referred_business_id 
          WHERE r.referrer_id = "Business".id AND s.status = 'active'
        )`),
        "active_referrals",
      ],
      [
        sequelize.literal(`(
          SELECT COALESCE(SUM(re.amount), 0) 
          FROM referral_earnings re 
          WHERE re.seller_id = "Business".id
        )`),
        "total_commission",
      ],
      [
        sequelize.literal(`(
          SELECT MAX(re.created_at) 
          FROM referral_earnings re 
          WHERE re.seller_id = "Business".id
        )`),
        "last_payout",
      ],
    ],
    where: {
      is_salesperson: true,
    },
    order: [[sequelize.literal("total_commission"), "DESC"]],
  });
};

exports.getSalespersonById = async (id) => {
  return Business.findOne({
    attributes: [
      "id",
      "business_name",
      "email",
      "phone",
      "address",
      "created_at",
      "updated_at",
      [
        sequelize.literal(`(
          SELECT COUNT(DISTINCT r.id) 
          FROM referrals r 
          WHERE r.referrer_id = "Business".id
        )`),
        "total_referrals",
      ],
      [
        sequelize.literal(`(
          SELECT COUNT(DISTINCT r.id) 
          FROM referrals r 
          JOIN subscriptions s ON s.business_id = r.referred_business_id 
          WHERE r.referrer_id = "Business".id AND s.status = 'active'
        )`),
        "active_referrals",
      ],
      [
        sequelize.literal(`(
          SELECT COALESCE(SUM(re.amount), 0) 
          FROM referral_earnings re 
          WHERE re.seller_id = "Business".id
        )`),
        "total_commission",
      ],
    ],
    where: {
      id,
      is_salesperson: true,
    },
  });
};

exports.getSalespersonReferrals = async (id) => {
  return Referral.findAll({
    attributes: ["id", "created_at"],
    include: [
      {
        model: Business,
        as: "referredBusiness",
        attributes: ["id", "business_name", "email"],
        include: [
          {
            model: Subscription,
            attributes: ["status"],
            required: false,
          },
        ],
      },
      {
        model: ReferralEarning,
        as: "earnings",
        attributes: ["amount", "status"],
        required: false,
      },
    ],
    where: {
      referrer_id: id,
    },
    order: [["created_at", "DESC"]],
  });
};

exports.getSalespersonPayments = async (id) => {
  return ReferralEarning.findAll({
    attributes: ["id", "amount", "status", "created_at"],
    include: [
      {
        model: Referral,
        as: "referral",
        attributes: ["id"],
        include: [
          {
            model: Business,
            as: "referredBusiness",
            attributes: ["id", "business_name"],
          },
        ],
      },
    ],
    where: {
      seller_id: id,
    },
    order: [["created_at", "DESC"]],
  });
};
