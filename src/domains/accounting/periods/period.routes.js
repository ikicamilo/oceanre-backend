// src/domains/accounting/periods/period.routes.js
const express = require("express");
const router = express.Router();
const controller = require("./period.controller");
const { authenticateJWT } = require("../../../middleware/authMiddleware");
const { authorizeRole } = require("../../../middleware/authorizeRole");
const {
  createAccountingPeriodValidator,
  updateAccountingPeriodValidator,
  changeStatusValidator,
} = require("../../../validators/accounting/accountingPeriodValidator");

/**
 * @swagger
 * tags:
 *   name: Accounting Periods
 *   description: Manage accounting periods workflow
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /accounting/periods:
 *   get:
 *     summary: Get all accounting periods
 *     tags: [Accounting Periods]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of periods
 */
router.get(
  "/",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  controller.getAll
);

/**
 * @swagger
 * /accounting/periods/{id}:
 *   get:
 *     summary: Get a specific accounting period
 *     tags: [Accounting Periods]
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
 *         description: Period object
 */
router.get(
  "/:id",
  authorizeRole("ADMIN", "ACCOUNTANT", "SALESPERSON"),
  controller.getById
);

/**
 * @swagger
 * /accounting/periods:
 *   post:
 *     summary: Create a new accounting period
 *     tags: [Accounting Periods]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               period_name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Period created
 */
router.post(
  "/",
  authorizeRole("ADMIN", "ACCOUNTANT"),
  createAccountingPeriodValidator,
  controller.create
);

/**
 * @swagger
 * /accounting/periods/{id}:
 *   put:
 *     summary: Update a period
 *     tags: [Accounting Periods]
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
 *               period_name:
 *                 type: string
 *               start_date:
 *                 type: string
 *                 format: date
 *               end_date:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Period updated
 */
router.put(
  "/:id",
  authorizeRole("ADMIN", "ACCOUNTANT"),
  updateAccountingPeriodValidator,
  controller.update
);

/**
 * @swagger
 * /accounting/periods/{id}/validate:
 *   post:
 *     summary: Validate period before calculation
 *     tags: [Accounting Periods]
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
 *         description: Period validated
 */
router.post(
  "/:id/validate",
  authorizeRole("ADMIN", "ACCOUNTANT"),
  controller.validatePeriod
);

/**
 * @swagger
 * /accounting/periods/{id}/calculate:
 *   post:
 *     summary: Calculate trial balance for period
 *     tags: [Accounting Periods]
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
 *         description: Calculation results
 */
router.post(
  "/:id/calculate",
  authorizeRole("ADMIN", "ACCOUNTANT"),
  controller.calculatePeriod
);

/**
 * @swagger
 * /accounting/periods/{id}/lock:
 *   post:
 *     summary: Lock period after validation
 *     tags: [Accounting Periods]
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
 *         description: Period locked
 */
router.post(
  "/:id/lock",
  authorizeRole("ADMIN", "ACCOUNTANT"),
  controller.lockPeriod
);

/**
 * @swagger
 * /accounting/periods/{id}/status:
 *   patch:
 *     summary: Change period status (OPEN, VALIDATING, CALCULATING, LOCKED, PUBLISHED, REOPENED)
 *     tags: [Accounting Periods]
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
 *               status:
 *                 type: string
 *                 enum: [OPEN, VALIDATING, CALCULATING, LOCKED, PUBLISHED, REOPENED]
 *     responses:
 *       200:
 *         description: Status changed
 *       400:
 *         description: Invalid transition or validation error
 */
router.patch(
  "/:id/status",
  authorizeRole("ADMIN"),
  changeStatusValidator,
  controller.changeStatus
);

/**
 * @swagger
 * /accounting/periods/{id}:
 *   delete:
 *     summary: Delete an accounting period
 *     tags: [Accounting Periods]
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
 *         description: Period deleted
 */
router.delete(
  "/:id",
  authorizeRole("ADMIN"),
  controller.remove
);

module.exports = router;
