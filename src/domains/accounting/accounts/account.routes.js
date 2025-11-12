const express = require('express');
const router = express.Router();
const controller = require('./account.controller');
const { authenticateJWT } = require('../../../middleware/authMiddleware');
const { authorizeRole } = require('../../../middleware/authorizeRole');
const { createAccountValidator } = require('../../../validators/accounting/accountValidator');

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: Manage chart of accounts
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /accounting/accounts:
 *   get:
 *     summary: Get all accounts
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of accounts
 */
router.get('/', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.getAll);

/**
 * @swagger
 * /accounting/accounts/{id}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
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
 *         description: Account details
 */
router.get('/:id', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.getById);

/**
 * @swagger
 * /accounting/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               account_code:
 *                 type: string
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [ASSET, LIABILITY, EQUITY, INCOME, EXPENSE]
 *     responses:
 *       201:
 *         description: Account created
 */
router.post('/', authorizeRole('ADMIN', 'ACCOUNTANT'), createAccountValidator, controller.create);

/**
 * @swagger
 * /accounting/accounts/{id}:
 *   put:
 *     summary: Update an account
 *     tags: [Accounts]
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
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account updated
 */
router.put('/:id', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.update);

/**
 * @swagger
 * /accounting/accounts/{id}:
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
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
 *         description: Account deleted
 */
router.delete('/:id', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.remove);

module.exports = router;
