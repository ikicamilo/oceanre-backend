// /src/models/index.js
const sequelize =
  require("../config/database").sequelize || require("../config/database");

// ====================
// Import Model Factories
// ====================
const UserModel = require("../auth/user.model");
const CustomerModel = require("../domains/sales/customers/customer.model");
const InvoiceModel = require("../domains/sales/invoices/invoice.model");
const ReceiptModel = require("../domains/sales/receipts/receipt.model");
const AccountModel = require("../domains/accounting/accounts/account.model");
const PeriodModel = require("../domains/accounting/periods/period.model");
const JournalEntryModel = require("../domains/accounting/journalEntries/journalEntry.model");
const JournalEntryLineModel = require("../domains/accounting/journalEntryLines/journalEntryLine.model");

// ====================
// Initialize Models
// ====================
const User = UserModel(sequelize);
const Customer = CustomerModel(sequelize);
const Invoice = InvoiceModel(sequelize);
const Receipt = ReceiptModel(sequelize);
const Account = AccountModel(sequelize);
const AccountingPeriod = PeriodModel(sequelize);
const JournalEntry = JournalEntryModel(sequelize);
const JournalEntryLine = JournalEntryLineModel(sequelize);

// ====================
// Define Associations
// ====================

// ---------- USER RELATIONS ----------
User.hasMany(Customer, { foreignKey: "created_by", as: "createdCustomers" });
User.hasMany(Customer, { foreignKey: "updated_by", as: "updatedCustomers" });

User.hasMany(Invoice, { foreignKey: "created_by", as: "createdInvoices" });
User.hasMany(Invoice, { foreignKey: "updated_by", as: "updatedInvoices" });

User.hasMany(Receipt, { foreignKey: "created_by", as: "createdReceipts" });
User.hasMany(Receipt, { foreignKey: "updated_by", as: "updatedReceipts" });

User.hasMany(Account, { foreignKey: "created_by", as: "createdAccounts" });
User.hasMany(Account, { foreignKey: "updated_by", as: "updatedAccounts" });

User.hasMany(AccountingPeriod, {
  foreignKey: "created_by",
  as: "createdPeriods",
});
User.hasMany(AccountingPeriod, {
  foreignKey: "updated_by",
  as: "updatedPeriods",
});

User.hasMany(JournalEntry, {
  foreignKey: "created_by",
  as: "createdJournalEntries",
});
User.hasMany(JournalEntry, {
  foreignKey: "updated_by",
  as: "updatedJournalEntries",
});

User.hasMany(JournalEntryLine, {
  foreignKey: "created_by",
  as: "createdJournalEntryLines",
});
User.hasMany(JournalEntryLine, {
  foreignKey: "updated_by",
  as: "updatedJournalEntryLines",
});

// ---------- CREATOR/UPDATER RELATIONS ----------
Customer.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Customer.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

Invoice.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Invoice.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

Receipt.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Receipt.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

Account.belongsTo(User, { as: "creator", foreignKey: "created_by" });
Account.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

AccountingPeriod.belongsTo(User, { as: "creator", foreignKey: "created_by" });
AccountingPeriod.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

JournalEntry.belongsTo(User, { as: "creator", foreignKey: "created_by" });
JournalEntry.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

JournalEntryLine.belongsTo(User, { as: "creator", foreignKey: "created_by" });
JournalEntryLine.belongsTo(User, { as: "updater", foreignKey: "updated_by" });

// ---------- SALES RELATIONS ----------
Customer.hasMany(Invoice, { foreignKey: "customer_id" });
Invoice.belongsTo(Customer, { foreignKey: "customer_id" });

Customer.hasMany(Receipt, { foreignKey: "customer_id" });
Receipt.belongsTo(Customer, { foreignKey: "customer_id" });

Invoice.hasMany(Receipt, { foreignKey: "invoice_id" });
Receipt.belongsTo(Invoice, { foreignKey: "invoice_id" });

// ---------- ACCOUNTING RELATIONS ----------
AccountingPeriod.hasMany(Invoice, { foreignKey: "period_id" });
Invoice.belongsTo(AccountingPeriod, { foreignKey: "period_id" });

AccountingPeriod.hasMany(Receipt, { foreignKey: "period_id" });
Receipt.belongsTo(AccountingPeriod, { foreignKey: "period_id" });

AccountingPeriod.hasMany(JournalEntry, { foreignKey: "period_id" });
JournalEntry.belongsTo(AccountingPeriod, { foreignKey: "period_id" });

JournalEntry.hasMany(JournalEntryLine, { foreignKey: "journal_entry_id" });
JournalEntryLine.belongsTo(JournalEntry, { foreignKey: "journal_entry_id" });

Account.hasMany(JournalEntryLine, { foreignKey: "account_id" });
JournalEntryLine.belongsTo(Account, { foreignKey: "account_id" });

// ====================
// Export
// ====================
module.exports = {
  sequelize,
  User,
  Customer,
  Invoice,
  Receipt,
  Account,
  AccountingPeriod,
  JournalEntry,
  JournalEntryLine,
};
