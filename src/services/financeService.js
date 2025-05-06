// src/services/financeService.js
const {
  Business,
  Subscription,
  ReferralEarning,
  Payment,
  sequelize,
} = require("../models");
const { Op } = require("sequelize");

exports.getFinancialOverview = async () => {
  // Get overview stats
  const stats = await sequelize.query(
    `
    SELECT
      COALESCE(SUM(p.amount), 0) as total_revenue,
      COALESCE(SUM(re.amount), 0) as total_commissions,
      COUNT(DISTINCT CASE WHEN s.status = 'active' THEN b.id END) as active_businesses,
      COUNT(DISTINCT CASE WHEN b.is_salesperson THEN b.id END) as total_salespeople
    FROM businesses b
    LEFT JOIN subscriptions s ON b.id = s.business_id
    LEFT JOIN payments p ON b.id = p.business_id
    LEFT JOIN referral_earnings re ON b.id = re.seller_id
  `,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  // Generate monthly data
  const monthlyData = await sequelize.query(
    `
    WITH RECURSIVE months AS (
      SELECT 
        DATE_TRUNC('month', CURRENT_DATE - INTERVAL '11 months') as month
      UNION ALL
      SELECT 
        DATE_TRUNC('month', month + INTERVAL '1 month')
      FROM months
      WHERE month < DATE_TRUNC('month', CURRENT_DATE)
    ),
    payment_data AS (
      SELECT 
        DATE_TRUNC('month', p.created_at) as month,
        COALESCE(SUM(p.amount), 0) as revenue
      FROM payments p
      WHERE p.created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', p.created_at)
    ),
    commission_data AS (
      SELECT 
        DATE_TRUNC('month', re.created_at) as month,
        COALESCE(SUM(re.amount), 0) as commissions
      FROM referral_earnings re
      WHERE re.created_at >= CURRENT_DATE - INTERVAL '12 months'
      GROUP BY DATE_TRUNC('month', re.created_at)
    )
    SELECT 
      months.month,
      COALESCE(payment_data.revenue, 0) as revenue,
      COALESCE(commission_data.commissions, 0) as commissions
    FROM months
    LEFT JOIN payment_data ON months.month = payment_data.month
    LEFT JOIN commission_data ON months.month = commission_data.month
    ORDER BY months.month ASC
  `,
    {
      type: sequelize.QueryTypes.SELECT,
    }
  );

  return {
    overview: {
      total_revenue: parseFloat(stats[0].total_revenue).toFixed(2),
      total_commissions: parseFloat(stats[0].total_commissions).toFixed(2),
      active_businesses: parseInt(stats[0].active_businesses),
      total_salespeople: parseInt(stats[0].total_salespeople),
    },
    monthlyData: monthlyData.map((row) => ({
      month: row.month,
      revenue: parseFloat(row.revenue).toFixed(2),
      commissions: parseFloat(row.commissions).toFixed(2),
    })),
  };
};

exports.getRevenueReport = async (startDate, endDate) => {
  return sequelize.query(
    `
    SELECT 
      DATE_TRUNC('day', p.created_at) as date,
      COUNT(DISTINCT p.id) as transactions,
      COALESCE(SUM(p.amount), 0) as revenue,
      COALESCE(SUM(re.amount), 0) as commissions,
      COALESCE(SUM(p.amount - COALESCE(re.amount, 0)), 0) as net_revenue
    FROM payments p
    LEFT JOIN referral_earnings re ON p.business_id = re.business_id AND DATE_TRUNC('day', p.created_at) = DATE_TRUNC('day', re.created_at)
    WHERE p.created_at BETWEEN :startDate AND :endDate
    GROUP BY date
    ORDER BY date
  `,
    {
      replacements: { startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    }
  );
};

exports.getCommissionsReport = async (startDate, endDate) => {
  return sequelize.query(
    `
    SELECT 
      b.business_name as salesperson,
      COUNT(DISTINCT r.id) as total_referrals,
      COUNT(DISTINCT CASE WHEN s.status = 'active' THEN r.id END) as active_referrals,
      COALESCE(SUM(re.amount), 0) as total_commission
    FROM businesses b
    LEFT JOIN referrals r ON b.id = r.referrer_id
    LEFT JOIN businesses rb ON r.referred_business_id = rb.id
    LEFT JOIN subscriptions s ON s.business_id = rb.id
    LEFT JOIN referral_earnings re ON re.seller_id = b.id
    WHERE b.is_salesperson = true
      AND re.created_at BETWEEN :startDate AND :endDate
    GROUP BY b.id, b.business_name
    ORDER BY total_commission DESC
  `,
    {
      replacements: { startDate, endDate },
      type: sequelize.QueryTypes.SELECT,
    }
  );
};
