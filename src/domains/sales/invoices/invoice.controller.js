//src/domains/sales/invoices/invoice.controller.js
const invoiceService = require("./invoice.service");

/**
 * GET /sales/invoices
 */
async function getAll(req, res, next) {
  try {
    const invoices = await invoiceService.getAllInvoices();
    res.json(invoices);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /sales/invoices/:id
 */
async function getById(req, res, next) {
  try {
    const invoice = await invoiceService.getInvoiceById(req.params.id);
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /sales/invoices
 */
async function create(req, res, next) {
  try {
    const userId = req.user.id;
    const invoice = await invoiceService.createInvoice(req.body, userId);
    res.status(201).json(invoice);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /sales/invoices/:id
 */
async function update(req, res, next) {
  try {
    const userId = req.user.id;
    const invoice = await invoiceService.updateInvoice(
      req.params.id,
      req.body,
      userId
    );
    res.json(invoice);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /sales/invoices/:id
 */
async function remove(req, res, next) {
  try {
    const result = await invoiceService.deleteInvoice(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
