//src/domains/sales/invoices/customer.controller.js
const customerService = require("./customer.service");

/**
 * GET /sales/customers
 */
async function getAll(req, res, next) {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (err) {
    next(err); // ✅ send to errorMiddleware
  }
}

/**
 * GET /sales/customers/:id
 */
async function getById(req, res, next) {
  try {
    const customer = await customerService.getCustomerById(req.params.id);
    res.json(customer);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /sales/customers
 */
async function create(req, res, next) {
  try {
    const userId = req.user.id;
    const customer = await customerService.createCustomer(req.body, userId);
    res.status(201).json(customer);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /sales/customers/:id
 */
async function update(req, res, next) {
  try {
    const userId = req.user.id;
    const customer = await customerService.updateCustomer(req.params.id, req.body, userId);
    res.json(customer);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /sales/customers/:id
 */
async function remove(req, res, next) {
  try {
    const result = await customerService.deleteCustomer(req.params.id);
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
