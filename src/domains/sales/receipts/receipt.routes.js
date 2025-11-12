const express = require("express");
const router = express.Router();
const controller = require("./receipt.controller");
const {
  createReceiptValidator,
  updateReceiptValidator,
} = require("../../../validators/sales/receiptValidator");
const { authenticateJWT } = require("../../../middleware/authMiddleware");
const { authorizeRole } = require("../../../middleware/authorizeRole");

/**
 * @swagger
 * tags:
 *   name: Receipts
 *   description: Manage sales receipts
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /sales/receipts:
 *   get:
 *     summary: Get all receipts
 *     tags: [Receipts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of receipts
 */
router.get(
  "/",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  controller.getAll
);

/**
 * @swagger
 * /sales/receipts/{id}:
 *   get:
 *     summary: Get a specific receipt
 *     tags: [Receipts]
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
 *         description: Receipt object
 */
router.get(
  "/:id",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  controller.getById
);

/**
 * @swagger
 * /sales/receipts:
 *   post:
 *     summary: Create a new receipt
 *     tags: [Receipts]
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
 *               payment_date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *     responses:
 *       201:
 *         description: Receipt created
 */
router.post(
  "/",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  createReceiptValidator,
  controller.create
);

/**
 * @swagger
 * /sales/receipts/{id}:
 *   put:
 *     summary: Update a receipt
 *     tags: [Receipts]
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
 *               payment_date:
 *                 type: string
 *                 format: date
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Receipt updated
 */
router.put(
  "/:id",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  updateReceiptValidator,
  controller.update
);

/**
 * @swagger
 * /sales/receipts/{id}:
 *   delete:
 *     summary: Delete a receipt
 *     tags: [Receipts]
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
 *         description: Receipt deleted
 */
router.delete(
  "/:id",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  controller.remove
);

module.exports = router;
