// src/validators/accountingPeriodValidator.js
const { body } = require("express-validator");

exports.createAccountingPeriodValidator = [
  body("period_name")
    .notEmpty()
    .withMessage("Period name is required")
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Period name must be in format YYYY-MM"),

  body("start_date")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .withMessage("Start date must be a valid date"),

  body("end_date")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .withMessage("End date must be a valid date"),
];

exports.updateAccountingPeriodValidator = [
  body("period_name")
    .optional()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/)
    .withMessage("Period name must be in format YYYY-MM"),

  body("start_date")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("end_date")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid date"),
];

exports.changeStatusValidator = [
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn([
      "OPEN",
      "VALIDATING",
      "CALCULATING",
      "LOCKED",
      "PUBLISHED",
      "REOPENED",
    ])
    .withMessage("Invalid status value"),
];
