//src/domains/sales/invoices/customer.service.js
const { Customer } = require('../../../models');
const CustomError = require('../../../utils/CustomError');

async function getAllCustomers() {
  try {
    return await Customer.findAll({ order: [['id', 'ASC']] });
  } catch (err) {
    throw new CustomError("Failed to retrieve customers.", 500);
  }
}

async function getCustomerById(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new CustomError("Customer not found", 404);
  return customer;
}

async function createCustomer(data, userId) {
  try {
    const customer = await Customer.create({
      ...data,
      created_by: userId,
    });
    return customer;
  } catch (err) {
    throw new CustomError("Error creating customer.", 400);
  }
}

async function updateCustomer(id, data, userId) {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new CustomError("Customer not found", 404);

  try {
    await customer.update({
      ...data,
      updated_by: userId,
    });
    return customer;
  } catch (err) {
    throw new CustomError("Error updating customer.", 400);
  }
}

async function deleteCustomer(id) {
  const customer = await Customer.findByPk(id);
  if (!customer) throw new CustomError("Customer not found", 404);

  try {
    await customer.destroy();
    return { message: "Customer deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting customer.", 400);
  }
}

module.exports = {
  getAllCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
};
