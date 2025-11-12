const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Account = sequelize.define(
    "Account",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      account_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
      },
      name: { type: DataTypes.STRING(100), allowNull: false },
      type: {
        type: DataTypes.ENUM(
          "ASSET",
          "LIABILITY",
          "INCOME",
          "EXPENSE",
          "EQUITY"
        ),
        allowNull: false,
      },
      is_postable: { type: DataTypes.BOOLEAN, defaultValue: true },
      active: { type: DataTypes.BOOLEAN, defaultValue: true },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER },
    },
    {
      tableName: "accounts",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return Account;
};
