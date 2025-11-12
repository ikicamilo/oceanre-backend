// src/domains/accounting/accounts/account.service.js
const { Account } = require("../../../models");
const CustomError = require("../../../utils/CustomError");

/**
 * Get all accounts
 */
async function getAllAccounts() {
  try {
    return await Account.findAll({ order: [["account_code", "ASC"]] });
  } catch (err) {
    throw new CustomError("Failed to retrieve accounts.", 500);
  }
}

/**
 * Get account by ID
 */
async function getAccountById(id) {
  try {
    const account = await Account.findByPk(id);
    if (!account) throw new CustomError("Account not found", 404);
    return account;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error fetching account details.", 500);
  }
}

/**
 * Create new account
 */
async function createAccount(data, userId) {
  try {
    const existing = await Account.findOne({
      where: { account_code: data.account_code },
    });
    if (existing) throw new CustomError("Account code already exists", 400);

    const account = await Account.create({
      account_code: data.account_code,
      name: data.name,
      type: data.type,
      is_postable: data.is_postable ?? true,
      active: true,
      created_by: userId,
    });

    return account;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error creating account.", 400);
  }
}

/**
 * Update existing account
 */
async function updateAccount(id, data, userId) {
  const account = await Account.findByPk(id);
  if (!account) throw new CustomError("Account not found", 404);

  try {
    await account.update({
      name: data.name ?? account.name,
      type: data.type ?? account.type,
      is_postable: data.is_postable ?? account.is_postable,
      active: data.active ?? account.active,
      updated_by: userId,
    });

    return account;
  } catch (err) {
    throw new CustomError("Error updating account.", 400);
  }
}

/**
 * Delete account
 */
async function deleteAccount(id) {
  const account = await Account.findByPk(id);
  if (!account) throw new CustomError("Account not found", 404);

  try {
    await account.destroy();
    return { message: "Account deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting account.", 400);
  }
}

module.exports = {
  getAllAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
};
