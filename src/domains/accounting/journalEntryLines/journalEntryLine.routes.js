const express = require('express');
const router = express.Router();
const controller = require('./journalEntryLine.controller');
const { authenticateJWT } = require('../../../middleware/authMiddleware');
const { authorizeRole } = require('../../../middleware/authorizeRole');
const { createJournalEntryLineValidator } = require('../../../validators/accounting/journalEntryLineValidator');

/**
 * @swagger
 * tags:
 *   name: Journal Entry Lines
 *   description: Manage journal entry lines (details)
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /accounting/journal-entry-lines/entry/{entryId}:
 *   get:
 *     summary: Get all lines for a specific journal entry
 *     tags: [Journal Entry Lines]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: entryId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Array of lines for that entry
 */
router.get('/entry/:entryId', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.getByEntry);

/**
 * @swagger
 * /accounting/journal-entry-lines:
 *   post:
 *     summary: Create a new journal entry line
 *     tags: [Journal Entry Lines]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               journal_entry_id:
 *                 type: integer
 *               account_id:
 *                 type: integer
 *               debit:
 *                 type: number
 *               credit:
 *                 type: number
 *     responses:
 *       201:
 *         description: Line created
 */
router.post('/', authorizeRole('ADMIN', 'ACCOUNTANT'), createJournalEntryLineValidator, controller.create);

/**
 * @swagger
 * /accounting/journal-entry-lines/{id}:
 *   delete:
 *     summary: Delete a journal entry line
 *     tags: [Journal Entry Lines]
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
 *         description: Line deleted
 */
router.delete('/:id', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.remove);

module.exports = router;
