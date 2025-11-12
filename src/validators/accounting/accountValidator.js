// src/validators/accountValidator.js
const { body } = require("express-validator");

exports.createAccountValidator = [
  body("account_code")
    .notEmpty()
    .withMessage("Account code is required")
    .isLength({ max: 10 })
    .withMessage("Max length is 10 characters"),

  body("name")
    .notEmpty()
    .withMessage("Account name is required")
    .isLength({ max: 100 })
    .withMessage("Max length is 100 characters"),

  body("type")
    .notEmpty()
    .withMessage("Account type is required")
    .isIn(["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"])
    .withMessage("Invalid account type"),
];

exports.updateAccountValidator = [
  body("name").optional().isLength({ max: 100 }),
  body("type")
    .optional()
    .isIn(["ASSET", "LIABILITY", "INCOME", "EXPENSE", "EQUITY"]),
  body("is_postable").optional().isBoolean(),
  body("active").optional().isBoolean(),
];
