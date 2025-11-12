// src/domains/accounting/journalEntryLines/journalEntryLine.service.js
const { JournalEntryLine, Account } = require("../../../models");
const CustomError = require("../../../utils/CustomError");

/**
 * Get all lines for a given journal entry
 */
async function getLinesByEntry(entryId) {
  try {
    const lines = await JournalEntryLine.findAll({
      where: { journal_entry_id: entryId },
      include: [
        { model: Account, attributes: ["account_code", "name", "type"] },
      ],
      order: [["id", "ASC"]],
    });

    if (!lines || lines.length === 0)
      throw new CustomError("No lines found for this journal entry", 404);

    return lines;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Failed to retrieve journal entry lines.", 500);
  }
}

/**
 * Create a new journal entry line
 */
async function createLine(data, userId) {
  try {
    if ((data.debit && data.credit) || (!data.debit && !data.credit)) {
      throw new CustomError(
        "Each line must have either a debit or a credit, not both or none.",
        400
      );
    }

    const line = await JournalEntryLine.create({
      journal_entry_id: data.journal_entry_id,
      account_id: data.account_id,
      debit: data.debit || null,
      credit: data.credit || null,
      currency: data.currency || "USD",
      created_by: userId,
    });

    return line;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error creating journal entry line.", 400);
  }
}

/**
 * Delete a journal entry line
 */
async function deleteLine(id) {
  const line = await JournalEntryLine.findByPk(id);
  if (!line) throw new CustomError("Journal entry line not found", 404);

  try {
    await line.destroy();
    return { message: "Journal entry line deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting journal entry line.", 400);
  }
}

module.exports = { getLinesByEntry, createLine, deleteLine };
