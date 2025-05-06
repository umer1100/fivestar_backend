// src/models/Payment.js
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define(
    "Payment",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      business_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
      },
      amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "completed",
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
      tableName: "payments",
      timestamps: false,
      underscored: true,
    }
  );

  Payment.associate = (models) => {
    Payment.belongsTo(models.Business, {
      foreignKey: "business_id",
      as: "business",
    });
  };

  return Payment;
};
