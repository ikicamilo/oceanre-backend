const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const JournalEntryLine = sequelize.define(
    "JournalEntryLine",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      journal_entry_id: { type: DataTypes.INTEGER, allowNull: false },
      account_id: { type: DataTypes.INTEGER, allowNull: false },
      debit: { type: DataTypes.DECIMAL(12, 2) },
      credit: { type: DataTypes.DECIMAL(12, 2) },
      currency: { type: DataTypes.STRING(3) },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER },
    },
    {
      tableName: "journal_entry_lines",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return JournalEntryLine;
};
