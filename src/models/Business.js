module.exports = (sequelize, DataTypes) => {
  const Business = sequelize.define(
    "Business",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      business_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      owner_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      address: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      google_review_link: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      referral_code: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      onboarding_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
      tableName: "businesses",
      timestamps: false,
      underscored: true,
    }
  );

  Business.associate = (models) => {
    Business.hasMany(models.Subscription, {
      foreignKey: "business_id",
      as: "subscriptions",
    });

    Business.hasMany(models.Review, {
      foreignKey: "business_id",
      as: "reviews",
    });

    Business.hasMany(models.QrCode, {
      foreignKey: "business_id",
      as: "qrCodes",
    });
  };

  return Business;
};
