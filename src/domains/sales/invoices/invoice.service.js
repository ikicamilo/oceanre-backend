//src/domains/sales/invoices/invoice.service.js
const { Invoice, Customer, AccountingPeriod } = require("../../../models");
const CustomError = require("../../../utils/CustomError");

/**
 * Fetch all invoices
 */
async function getAllInvoices() {
  try {
    return await Invoice.findAll({
      include: [{ model: Customer, attributes: ["id", "name", "email"] }],
      order: [["id", "ASC"]],
    });
  } catch (err) {
    throw new CustomError("Failed to retrieve invoices.", 500);
  }
}

/**
 * Get invoice by ID
 */
async function getInvoiceById(id) {
  try {
    const invoice = await Invoice.findByPk(id, {
      include: [{ model: Customer, attributes: ["id", "name", "email"] }],
    });
    if (!invoice) throw new CustomError("Invoice not found", 404);
    return invoice;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error fetching invoice details.", 500);
  }
}

/**
 * Create invoice
 */
async function createInvoice(data, userId) {
  try {
    // Validate period (if provided)
    if (data.period_id) {
      const period = await AccountingPeriod.findByPk(data.period_id);
      if (!period) throw new CustomError("Invalid accounting period", 400);
    }

    const invoice = await Invoice.create({
      ...data,
      created_by: userId,
    });

    return invoice;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error creating invoice.", 400);
  }
}

/**
 * Update invoice
 */
async function updateInvoice(id, data, userId) {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) throw new CustomError("Invoice not found", 404);

  try {
    await invoice.update({ ...data, updated_by: userId });
    return invoice;
  } catch (err) {
    throw new CustomError("Error updating invoice.", 400);
  }
}

/**
 * Delete invoice
 */
async function deleteInvoice(id) {
  const invoice = await Invoice.findByPk(id);
  if (!invoice) throw new CustomError("Invoice not found", 404);

  try {
    await invoice.destroy();
    return { message: "Invoice deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting invoice.", 400);
  }
}

module.exports = {
  getAllInvoices,
  getInvoiceById,
  createInvoice,
  updateInvoice,
  deleteInvoice,
};
