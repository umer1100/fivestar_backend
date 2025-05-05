module.exports = (sequelize, DataTypes) => {
  const BankDetail = sequelize.define(
    "BankDetail",
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
        unique: true,
      },
      account_holder_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      transit_number: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
          is: /^\d{5}$/,
        },
      },
      institution_number: {
        type: DataTypes.STRING(3),
        allowNull: false,
        validate: {
          is: /^\d{3}$/,
        },
      },
      account_number: {
        type: DataTypes.STRING(12),
        allowNull: false,
        validate: {
          is: /^\d{7,12}$/,
        },
      },
      bank_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      account_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
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
      tableName: "bank_details",
      timestamps: false,
      underscored: true,
    }
  );

  BankDetail.associate = (models) => {
    BankDetail.belongsTo(models.Business, {
      foreignKey: "business_id",
      as: "business",
    });
  };

  return BankDetail;
};
;