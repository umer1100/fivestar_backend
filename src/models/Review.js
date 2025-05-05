module.exports = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "Review",
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
      customer_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
      comment: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      replied_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      source: {
        type: DataTypes.STRING(50),
        defaultValue: "direct",
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
      },
    },
    {
      tableName: "reviews",
      timestamps: false,
      underscored: true,
    }
  );

  Review.associate = (models) => {
    Review.belongsTo(models.Business, {
      foreignKey: "business_id",
      as: "business",
    });
  };

  return Review;
};
