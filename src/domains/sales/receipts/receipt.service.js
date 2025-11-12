// src/domains/sales/receipts/receipt.service.js
const { Receipt, Customer, AccountingPeriod } = require("../../../models");
const CustomError = require("../../../utils/CustomError");

/**
 * Get all receipts
 */
async function getAllReceipts() {
  try {
    return await Receipt.findAll({
      include: [
        { model: Customer, attributes: ["id", "name", "email"] },
        { model: AccountingPeriod, attributes: ["id", "period_name", "status"] },
      ],
      order: [["id", "ASC"]],
    });
  } catch (err) {
    throw new CustomError("Failed to retrieve receipts.", 500);
  }
}

/**
 * Get a single receipt by ID
 */
async function getReceiptById(id) {
  try {
    const receipt = await Receipt.findByPk(id, {
      include: [
        { model: Customer, attributes: ["id", "name", "email"] },
        { model: AccountingPeriod, attributes: ["id", "period_name", "status"] },
      ],
    });
    if (!receipt) throw new CustomError("Receipt not found", 404);
    return receipt;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error fetching receipt details.", 500);
  }
}

/**
 * Create a new receipt
 */
async function createReceipt(data, userId) {
  try {
    if (data.period_id) {
      const period = await AccountingPeriod.findByPk(data.period_id);
      if (!period) throw new CustomError("Invalid accounting period", 400);
    }

    const receipt = await Receipt.create({
      receipt_number: data.receipt_number,
      payment_date: data.payment_date,
      amount: data.amount,
      currency: data.currency || "USD",
      customer_id: data.customer_id,
      invoice_id: data.invoice_id || null,
      period_id: data.period_id || null,
      created_by: userId,
    });

    // Journal entry automatically created by DB trigger if period_id is set
    return receipt;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error creating receipt.", 400);
  }
}

/**
 * Update an existing receipt
 */
async function updateReceipt(id, data, userId) {
  const receipt = await Receipt.findByPk(id);
  if (!receipt) throw new CustomError("Receipt not found", 404);

  try {
    await receipt.update({
      payment_date: data.payment_date ?? receipt.payment_date,
      amount: data.amount ?? receipt.amount,
      currency: data.currency ?? receipt.currency,
      customer_id: data.customer_id ?? receipt.customer_id,
      invoice_id: data.invoice_id ?? receipt.invoice_id,
      period_id: data.period_id ?? receipt.period_id,
      updated_by: userId,
    });

    return receipt;
  } catch (err) {
    throw new CustomError("Error updating receipt.", 400);
  }
}

/**
 * Delete a receipt
 */
async function deleteReceipt(id) {
  const receipt = await Receipt.findByPk(id);
  if (!receipt) throw new CustomError("Receipt not found", 404);

  try {
    await receipt.destroy();
    return { message: "Receipt deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting receipt.", 400);
  }
}

module.exports = {
  getAllReceipts,
  getReceiptById,
  createReceipt,
  updateReceipt,
  deleteReceipt,
};
