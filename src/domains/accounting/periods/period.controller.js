// src/domains/accounting/periods/period.controller.js
const service = require("./period.service");
const { validationResult } = require("express-validator");

/**
 * GET /accounting/periods
 */
async function getAll(req, res, next) {
  try {
    const result = await service.getAllPeriods();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /accounting/periods/:id
 */
async function getById(req, res, next) {
  try {
    const result = await service.getPeriodById(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/periods
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const result = await service.createPeriod(req.body, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /accounting/periods/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const result = await service.updatePeriod(req.params.id, req.body, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /accounting/periods/:id
 */
async function remove(req, res, next) {
  try {
    const result = await service.deletePeriod(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PATCH /accounting/periods/:id/status
 */
async function changeStatus(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await service.changeStatus(
      req.params.id,
      req.body.status,
      userId
    );
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/periods/:id/validate
 */
async function validatePeriod(req, res, next) {
  try {
    const result = await service.validatePeriod(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/periods/:id/calculate
 */
async function calculatePeriod(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await service.calculatePeriod(req.params.id, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/periods/:id/lock
 */
async function lockPeriod(req, res, next) {
  try {
    const userId = req.user.id;
    const result = await service.lockPeriod(req.params.id, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  validatePeriod,
  changeStatus,
  calculatePeriod,
  lockPeriod,
};
