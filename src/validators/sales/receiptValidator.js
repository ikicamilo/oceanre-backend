// src/validators/receiptValidator.js
const { body } = require("express-validator");

exports.createReceiptValidator = [
  body("receipt_number")
    .notEmpty()
    .withMessage("Receipt number is required")
    .isLength({ max: 20 })
    .withMessage("Receipt number must not exceed 20 characters"),

  body("payment_date")
    .notEmpty()
    .withMessage("Payment date is required")
    .isISO8601()
    .withMessage("Payment date must be a valid date"),

  body("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),

  body("currency")
    .optional()
    .isLength({ min: 3, max: 3 })
    .withMessage("Currency must be a valid ISO code"),

  body("customer_id")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isInt()
    .withMessage("Customer ID must be an integer"),

  body("invoice_id")
    .optional()
    .isInt()
    .withMessage("Invoice ID must be an integer"),

  body("period_id")
    .optional()
    .isInt()
    .withMessage("Period ID must be an integer"),
];

exports.updateReceiptValidator = [
  body("payment_date")
    .optional()
    .isISO8601()
    .withMessage("Must be a valid date"),
  body("amount")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Must be greater than 0"),
  body("currency").optional().isLength({ min: 3, max: 3 }),
  body("customer_id").optional().isInt(),
  body("invoice_id").optional().isInt(),
  body("period_id").optional().isInt(),
];
