module.exports = (sequelize, DataTypes) => {
  const Referral = sequelize.define(
    "Referral",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      referrer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
      },
      referred_business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
      },
      status: {
        type: DataTypes.STRING(50),
        defaultValue: "pending",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "referrals",
      timestamps: false,
      underscored: true,
    }
  );

  Referral.associate = (models) => {
    Referral.belongsTo(models.Business, {
      foreignKey: "referrer_id",
      as: "referrer",
    });

    Referral.belongsTo(models.Business, {
      foreignKey: "referred_business_id",
      as: "referredBusiness",
    });

    Referral.hasMany(models.ReferralEarning, {
      foreignKey: "referral_id",
      as: "earnings",
    });
  };

  return Referral;
};
