module.exports = (sequelize, DataTypes) => {
  const QrCode = sequelize.define(
    "QrCode",
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
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      url: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      scans: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
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
      tableName: "qr_codes",
      timestamps: false,
      underscored: true,
      indexes: [
        {
          unique: true,
          fields: ["business_id", "type"],
        },
      ],
    }
  );

  QrCode.associate = (models) => {
    QrCode.belongsTo(models.Business, {
      foreignKey: "business_id",
      as: "business",
    });
  };

  return QrCode;
};
