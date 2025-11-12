const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const AccountingPeriod = sequelize.define(
    "AccountingPeriod",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      period_name: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      start_date: { type: DataTypes.DATEONLY, allowNull: false },
      end_date: { type: DataTypes.DATEONLY, allowNull: false },
      status: {
        type: DataTypes.ENUM(
          "OPEN",
          "VALIDATING",
          "CALCULATING",
          "LOCKED",
          "PUBLISHED",
          "REOPENED"
        ),
        allowNull: false,
      },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER },
    },
    {
      tableName: "accounting_periods",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return AccountingPeriod;
};
