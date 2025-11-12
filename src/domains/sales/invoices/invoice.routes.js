const express = require('express');
const router = express.Router();
const invoiceController = require('./invoice.controller');
const { authenticateJWT } = require('../../../middleware/authMiddleware');
const { authorizeRole } = require('../../../middleware/authorizeRole');
const { createInvoiceValidator } = require('../../../validators/sales/invoiceValidator');

/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: Manage customer invoices
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /sales/invoices:
 *   get:
 *     summary: List all invoices
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of invoices
 */
router.get('/', authorizeRole('ADMIN', 'ACCOUNTANT', 'SALESPERSON'), invoiceController.getAll);

/**
 * @swagger
 * /sales/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     tags: [Invoices]
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
 *         description: Invoice details
 *       404:
 *         description: Invoice not found
 */
router.get('/:id', authorizeRole('ADMIN', 'ACCOUNTANT', 'SALESPERSON'), invoiceController.getById);

/**
 * @swagger
 * /sales/invoices:
 *   post:
 *     summary: Create a new invoice
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customer_id:
 *                 type: integer
 *               issue_date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Invoice created
 */
router.post('/', authorizeRole('ADMIN', 'SALESPERSON'), createInvoiceValidator, invoiceController.create);

/**
 * @swagger
 * /sales/invoices/{id}:
 *   put:
 *     summary: Update an existing invoice
 *     tags: [Invoices]
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
 *               issue_date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Invoice updated
 */
router.put('/:id', authorizeRole('ADMIN', 'SALESPERSON'), createInvoiceValidator, invoiceController.update);

/**
 * @swagger
 * /sales/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     tags: [Invoices]
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
 *         description: Invoice deleted
 */
router.delete('/:id', authorizeRole('ADMIN'), invoiceController.remove);

module.exports = router;
