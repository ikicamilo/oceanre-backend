// src/domains/sales/receipts/receipt.controller.js
const receiptService = require("./receipt.service");
const { validationResult } = require("express-validator");

/**
 * GET /sales/receipts
 */
async function getAll(req, res, next) {
  try {
    const receipts = await receiptService.getAllReceipts();
    res.json(receipts);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /sales/receipts/:id
 */
async function getById(req, res, next) {
  try {
    const receipt = await receiptService.getReceiptById(req.params.id);
    if (!receipt) return res.status(404).json({ message: "Receipt not found" });
    res.json(receipt);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /sales/receipts
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const receipt = await receiptService.createReceipt(req.body, userId);
    res.status(201).json(receipt);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /sales/receipts/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const updated = await receiptService.updateReceipt(
      req.params.id,
      req.body,
      userId
    );
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /sales/receipts/:id
 */
async function remove(req, res, next) {
  try {
    const result = await receiptService.deleteReceipt(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
