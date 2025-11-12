// /src/validators/invoiceValidator.js
const { body, validationResult } = require("express-validator");

const createInvoiceValidator = [
  body("invoice_number")
    .notEmpty()
    .withMessage("Invoice number is required")
    .isLength({ max: 20 })
    .withMessage("Invoice number too long"),

  body("issue_date")
    .notEmpty()
    .withMessage("Issue date is required")
    .isISO8601()
    .withMessage("Invalid issue date"),

  body("due_date")
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage("Invalid due date"),

  body("customer_id")
    .notEmpty()
    .withMessage("Customer ID is required")
    .isInt()
    .withMessage("Customer ID must be an integer"),

  body("total_amount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be positive"),

  body("currency")
    .optional({ checkFalsy: true })
    .isLength({ max: 3 })
    .withMessage("Currency must be a 3-character code"),

  body("status")
    .optional({ checkFalsy: true })
    .isIn(["OPEN", "PAID", "CANCELLED"])
    .withMessage("Invalid status"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = { createInvoiceValidator };
