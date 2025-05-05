"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("bank_details", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      business_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "businesses",
          key: "id",
        },
        unique: true,
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      account_holder_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      transit_number: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      institution_number: {
        type: Sequelize.STRING(3),
        allowNull: false,
      },
      account_number: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      bank_name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      account_type: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("bank_details");
  },
};
