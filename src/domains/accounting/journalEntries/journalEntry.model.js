const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const JournalEntry = sequelize.define(
    "JournalEntry",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      entry_number: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      posting_date: { type: DataTypes.DATEONLY, allowNull: false },
      description: { type: DataTypes.STRING(255) },
      source_reference: { type: DataTypes.STRING(50) },
      period_id: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
      updated_by: { type: DataTypes.INTEGER },
    },
    {
      tableName: "journal_entries",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
      underscored: true,
    }
  );
  return JournalEntry;
};
