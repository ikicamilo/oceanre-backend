const express = require('express');
const router = express.Router();
const controller = require('./journalEntry.controller');
const { authenticateJWT } = require('../../../middleware/authMiddleware');
const { authorizeRole } = require('../../../middleware/authorizeRole');
const { createJournalEntryValidator } = require('../../../validators/accounting/journalEntryValidator');

/**
 * @swagger
 * tags:
 *   name: Journal Entries
 *   description: Manage journal entries (headers)
 */

router.use(authenticateJWT);

/**
 * @swagger
 * /accounting/journal-entries:
 *   get:
 *     summary: List all journal entries
 *     tags: [Journal Entries]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Array of journal entries
 */
router.get('/', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.getAll);

/**
 * @swagger
 * /accounting/journal-entries/{id}:
 *   get:
 *     summary: Get a journal entry by ID
 *     tags: [Journal Entries]
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
 *         description: Journal entry details
 */
router.get('/:id', authorizeRole('ADMIN', 'ACCOUNTANT'), controller.getById);

/**
 * @swagger
 * /accounting/journal-entries:
 *   post:
 *     summary: Create a new journal entry
 *     tags: [Journal Entries]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               entry_number:
 *                 type: string
 *               posting_date:
 *                 type: string
 *                 format: date
 *               description:
 *                 type: string
 *               period_id:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Journal entry created
 */
router.post('/', authorizeRole('ADMIN', 'ACCOUNTANT'), createJournalEntryValidator, controller.create);

/**
 * @swagger
 * /accounting/journal-entries/{id}:
 *   put:
 *     summary: Update a journal entry
 *     tags: [Journal Entries]
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
 *         description: Journal entry updated
 */
router.put('/:id', authorizeRole('ADMIN', 'ACCOUNTANT'), createJournalEntryValidator, controller.update);

/**
 * @swagger
 * /accounting/journal-entries/{id}:
 *   delete:
 *     summary: Delete a journal entry
 *     tags: [Journal Entries]
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
 *         description: Journal entry deleted
 */
router.delete('/:id', authorizeRole('ADMIN'), controller.remove);

module.exports = router;
