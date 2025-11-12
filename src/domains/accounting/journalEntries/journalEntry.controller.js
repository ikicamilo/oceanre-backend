// src/domains/accounting/journalEntries/journalEntry.controller.js
const service = require("./journalEntry.service");
const { validationResult } = require("express-validator");

/**
 * GET /accounting/journal-entries
 */
async function getAll(req, res, next) {
  try {
    const result = await service.getAllJournalEntries();
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /accounting/journal-entries/:id
 */
async function getById(req, res, next) {
  try {
    const result = await service.getJournalEntryById(req.params.id);
    if (!result) return res.status(404).json({ message: "Journal entry not found" });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * POST /accounting/journal-entries
 */
async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const result = await service.createJournalEntry(req.body, userId);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /accounting/journal-entries/:id
 */
async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const result = await service.updateJournalEntry(req.params.id, req.body, userId);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /accounting/journal-entries/:id
 */
async function remove(req, res, next) {
  try {
    const result = await service.deleteJournalEntry(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, create, update, remove };
