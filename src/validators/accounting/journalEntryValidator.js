// src/validators/journalEntryValidator.js
const { body } = require("express-validator");

exports.createJournalEntryValidator = [
  body("entry_number").notEmpty().withMessage("Entry number required"),
  body("posting_date")
    .notEmpty()
    .isISO8601()
    .withMessage("Valid posting date required"),
  body("period_id").notEmpty().isInt().withMessage("Period ID required"),
];

exports.updateJournalEntryValidator = [
  body("posting_date").optional().isISO8601(),
  body("description").optional().isLength({ max: 255 }),
];
