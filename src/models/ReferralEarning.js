module.exports = (sequelize, DataTypes) => {
  const ReferralEarning = sequelize.define(
    "ReferralEarning",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      referral_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "referrals",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      month: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "referral_earnings",
      timestamps: false,
      underscored: true,
    }
  );

  ReferralEarning.associate = (models) => {
    ReferralEarning.belongsTo(models.Referral, {
      foreignKey: "referral_id",
      as: "referral",
    });
  };

  return ReferralEarning;
};
