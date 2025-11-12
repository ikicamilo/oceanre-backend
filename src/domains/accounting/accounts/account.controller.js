// src/domains/accounting/accounts/account.controller.js
const service = require("./account.service");
const { validationResult } = require("express-validator");

/**
 * GET /accounting/accounts
 */
async function getAll(req, res, next) {
  try {
    const result = await service.getAllAccounts();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /accounting/accounts/:id
 */
async function getById(req, res, next) {
  try {
    const result = await service.getAccountById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/accounts
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const result = await service.createAccount(req.body, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /accounting/accounts/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const result = await service.updateAccount(req.params.id, req.body, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /accounting/accounts/:id
 */
async function remove(req, res, next) {
  try {
    const result = await service.deleteAccount(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
