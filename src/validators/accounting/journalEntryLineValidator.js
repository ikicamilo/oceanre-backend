// src/validators/journalEntryLineValidator.js
const { body } = require('express-validator');

exports.createJournalEntryLineValidator = [
  body('journal_entry_id').notEmpty().isInt(),
  body('account_id').notEmpty().isInt(),
  body('debit').optional().isFloat({ gt: 0 }),
  body('credit').optional().isFloat({ gt: 0 }),
  body('currency').optional().isLength({ min: 3, max: 3 }),
];
