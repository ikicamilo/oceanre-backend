// src/domains/accounting/journalEntryLines/journalEntryLine.controller.js
const service = require("./journalEntryLine.service");
const { validationResult } = require("express-validator");

/**
 * GET /accounting/journal-entry-lines/:entryId
 * Get all lines for a specific journal entry
 */
async function getByEntry(req, res, next) {
  try {
    const lines = await service.getLinesByEntry(req.params.entryId);
    res.json(lines);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/journal-entry-lines
 * Create a new journal entry line
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const line = await service.createLine(req.body, userId);
    res.status(201).json(line);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /accounting/journal-entry-lines/:id
 */
async function remove(req, res, next) {
  try {
    const result = await service.deleteLine(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getByEntry,
  create,
  remove,
};
