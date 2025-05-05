const {
  Business,
  Referral,
  ReferralEarning,
  Subscription,
} = require("../models");
const { Op } = require("sequelize");

/**
 * Get referral dashboard data for the authenticated business
 */
exports.getReferralDashboard = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    console.log("Fetching dashboard for business:", businessId);

    // Get referral stats with aggregations
    const stats = await Referral.findOne({
      attributes: [
        [sequelize.fn("COUNT", sequelize.col("Referral.id")), "totalReferrals"],
        [
          sequelize.fn(
            "COUNT",
            sequelize.literal(
              'DISTINCT CASE WHEN "referredBusiness->Subscription"."status" = \'active\' THEN "Referral"."id" END'
            )
          ),
          "activeReferrals",
        ],
        [
          sequelize.fn(
            "COALESCE",
            sequelize.fn("SUM", sequelize.col("earnings.amount")),
            0
          ),
          "totalEarnings",
        ],
      ],
      where: {
        referrer_id: businessId,
      },
      include: [
        {
          model: Business,
          as: "referredBusiness",
          include: [
            {
              model: Subscription,
              required: false,
            },
          ],
        },
        {
          model: ReferralEarning,
          as: "earnings",
          required: false,
        },
      ],
      group: ["Referral.referrer_id"],
    });

    // Get detailed referral information
    const referrals = await Referral.findAll({
      attributes: ["id", "created_at"],
      where: {
        referrer_id: businessId,
      },
      include: [
        {
          model: Business,
          as: "referredBusiness",
          attributes: ["id", "business_name", "email", "onboarding_completed"],
          include: [
            {
              model: Subscription,
              required: false,
              attributes: ["status"],
            },
          ],
        },
        {
          model: ReferralEarning,
          as: "earnings",
          required: false,
          attributes: ["amount"],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    // Format response
    const formattedReferrals = referrals.map((referral) => {
      const subscription = referral.referredBusiness?.Subscription;
      const status = determineReferralStatus({
        onboarding_completed: referral.referredBusiness?.onboarding_completed,
        subscription_status: subscription?.status,
      });

      return {
        id: referral.id,
        referredBusinessId: referral.referredBusiness.id,
        businessName: referral.referredBusiness.business_name,
        email: referral.referredBusiness.email,
        status,
        createdAt: referral.created_at,
        earnings: parseFloat(
          referral.earnings?.reduce(
            (sum, earning) => sum + parseFloat(earning.amount || 0),
            0
          ) || 0
        ),
        onboardingCompleted: referral.referredBusiness.onboarding_completed,
        subscriptionStatus: subscription?.status,
      };
    });

    // Prepare response stats
    const statsData = stats
      ? {
          totalReferrals: parseInt(stats.dataValues.totalReferrals || "0"),
          activeReferrals: parseInt(stats.dataValues.activeReferrals || "0"),
          totalEarnings: parseFloat(stats.dataValues.totalEarnings || "0"),
        }
      : {
          totalReferrals: 0,
          activeReferrals: 0,
          totalEarnings: 0,
        };

    res.json({
      stats: statsData,
      referrals: formattedReferrals,
    });
  } catch (error) {
    console.error("Error fetching referral dashboard:", error.message);
    console.error("Error details:", error);
    res.status(500).json({ message: "Failed to load referral data" });
  }
};

/**
 * Helper function to determine referral status
 */
function determineReferralStatus(referral) {
  if (!referral.onboarding_completed) {
    return "pending_onboarding";
  }
  if (referral.subscription_status !== "active") {
    return "pending_subscription";
  }
  return "active";
}

/**
 * Generate or retrieve a referral code for the authenticated business
 */
exports.generateReferralCode = async (req, res) => {
  try {
    const businessId = req.user.businessId;
    console.log("Generating code for business:", businessId);

    // Find business and check for existing code
    const business = await Business.findByPk(businessId);

    if (business.referral_code) {
      console.log("Existing referral code found:", business.referral_code);
      return res.json({ referralCode: business.referral_code });
    }

    // Generate new unique referral code
    const referralCode = Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase();

    // Update business with new code
    await business.update({ referral_code: referralCode });

    console.log("Generated new referral code:", referralCode);
    res.json({ referralCode });
  } catch (error) {
    console.error("Error generating referral code:", error);
    res.status(500).json({ message: "Failed to generate referral code" });
  }
};

/**
 * Record a referral earning when a referred business makes a payment
 */
exports.recordReferralEarning = async (businessId, paymentAmount) => {
  const transaction = await sequelize.transaction();

  try {
    // Find the referral record
    const referral = await Referral.findOne({
      where: {
        referred_business_id: businessId,
        status: "active",
      },
      transaction,
    });

    if (referral) {
      const commissionAmount = 75; // Fixed commission amount

      // Record the earning
      await ReferralEarning.create(
        {
          referral_id: referral.id,
          amount: commissionAmount,
          month: sequelize.fn("DATE_TRUNC", "month", sequelize.fn("NOW")),
        },
        { transaction }
      );
    }

    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Error recording referral earning:", error);
  }
};
