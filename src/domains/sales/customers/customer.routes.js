const express = require("express");
const router = express.Router();
const customerController = require("./customer.controller");
const { authenticateJWT } = require("../../../middleware/authMiddleware");
const { authorizeRole } = require("../../../middleware/authorizeRole");
const { createCustomerValidator } = require("../../../validators/sales/customerValidator");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Manage sales customers
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /sales/customers:
 *   get:
 *     summary: List all customers
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of customers
 */
router.get("/", authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"), customerController.getAll);

/**
 * @swagger
 * /sales/customers/{id}:
 *   get:
 *     summary: Get customer by ID
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer object
 *       404:
 *         description: Customer not found
 */
router.get("/:id", authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"), customerController.getById);

/**
 * @swagger
 * /sales/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Validation error
 */
router.post("/", authorizeRole("ADMIN", "SALESPERSON"), createCustomerValidator, customerController.create);

/**
 * @swagger
 * /sales/customers/{id}:
 *   put:
 *     summary: Update existing customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       404:
 *         description: Customer not found
 */
router.put("/:id", authorizeRole("ADMIN", "SALESPERSON"), customerController.update);

/**
 * @swagger
 * /sales/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 */
router.delete("/:id", authorizeRole("ADMIN"), customerController.remove);

module.exports = router;
