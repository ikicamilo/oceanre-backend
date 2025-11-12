// src/domains/accounting/journalEntries/journalEntry.service.js
const { JournalEntry, JournalEntryLine, AccountingPeriod } = require("../../../models");
const CustomError = require("../../../utils/CustomError");

/**
 * Get all journal entries
 */
async function getAllJournalEntries() {
  try {
    return await JournalEntry.findAll({
      include: [
        { model: AccountingPeriod, attributes: ["id", "period_name", "status"] },
      ],
      order: [["posting_date", "ASC"]],
    });
  } catch (err) {
    throw new CustomError("Failed to retrieve journal entries.", 500);
  }
}

/**
 * Get a journal entry by ID
 */
async function getJournalEntryById(id) {
  try {
    const entry = await JournalEntry.findByPk(id, {
      include: [{ model: JournalEntryLine }],
    });
    if (!entry) throw new CustomError("Journal entry not found", 404);
    return entry;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error fetching journal entry details.", 500);
  }
}

/**
 * Create a new journal entry
 */
async function createJournalEntry(data, userId) {
  try {
    if (data.period_id) {
      const period = await AccountingPeriod.findByPk(data.period_id);
      if (!period) throw new CustomError("Invalid accounting period", 400);
    }

    const entry = await JournalEntry.create({
      entry_number: data.entry_number,
      posting_date: data.posting_date,
      description: data.description,
      source_reference: data.source_reference || null,
      period_id: data.period_id || null,
      created_by: userId,
    });

    return entry;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error creating journal entry.", 400);
  }
}

/**
 * Update an existing journal entry
 */
async function updateJournalEntry(id, data, userId) {
  const entry = await JournalEntry.findByPk(id);
  if (!entry) throw new CustomError("Journal entry not found", 404);

  try {
    await entry.update({
      posting_date: data.posting_date ?? entry.posting_date,
      description: data.description ?? entry.description,
      updated_by: userId,
    });

    return entry;
  } catch (err) {
    throw new CustomError("Error updating journal entry.", 400);
  }
}

/**
 * Delete a journal entry
 */
async function deleteJournalEntry(id) {
  const entry = await JournalEntry.findByPk(id);
  if (!entry) throw new CustomError("Journal entry not found", 404);

  try {
    await entry.destroy(); // cascades to lines
    return { message: "Journal entry deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting journal entry.", 400);
  }
}

module.exports = {
  getAllJournalEntries,
  getJournalEntryById,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
};
