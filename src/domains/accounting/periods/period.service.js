// src/domains/accounting/periods/period.service.js
const { AccountingPeriod, Invoice, Receipt, sequelize } = require("../../../models");
const { Op } = require("sequelize");
const CustomError = require("../../../utils/CustomError");

/**
 * Get all periods
 */
async function getAllPeriods() {
  try {
    return await AccountingPeriod.findAll({ order: [["start_date", "ASC"]] });
  } catch (err) {
    throw new CustomError("Failed to retrieve accounting periods.", 500);
  }
}

/**
 * Get a period by ID
 */
async function getPeriodById(id) {
  try {
    const period = await AccountingPeriod.findByPk(id);
    if (!period) throw new CustomError("Accounting period not found", 404);
    return period;
  } catch (err) {
    if (err instanceof CustomError) throw err;
    throw new CustomError("Error fetching accounting period.", 500);
  }
}

/**
 * Create a new accounting period
 */
async function createPeriod(data, userId) {
  const existing = await AccountingPeriod.findOne({
    where: { period_name: data.period_name },
  });
  if (existing) throw new CustomError("A period with this name already exists", 400);

  try {
    const period = await AccountingPeriod.create({
      period_name: data.period_name,
      start_date: data.start_date,
      end_date: data.end_date,
      status: "OPEN",
      created_by: userId,
    });
    return period;
  } catch (err) {
    throw new CustomError("Error creating accounting period.", 400);
  }
}

/**
 * Update an existing period
 */
async function updatePeriod(id, data, userId) {
  const period = await getPeriodById(id);

  if (!["OPEN", "REOPENED"].includes(period.status))
    throw new CustomError("Only OPEN or REOPENED periods can be modified", 400);

  try {
    await period.update({
      period_name: data.period_name ?? period.period_name,
      start_date: data.start_date ?? period.start_date,
      end_date: data.end_date ?? period.end_date,
      updated_by: userId,
    });
    return period;
  } catch (err) {
    throw new CustomError("Error updating accounting period.", 400);
  }
}

/**
 * Delete a period
 */
async function deletePeriod(id) {
  const period = await getPeriodById(id);

  if (period.status !== "OPEN")
    throw new CustomError("Only OPEN periods can be deleted", 400);

  try {
    await period.destroy();
    return { message: "Accounting period deleted successfully" };
  } catch (err) {
    throw new CustomError("Error deleting accounting period.", 400);
  }
}

/**
 * Change status with validation of allowed transitions
 */
async function changeStatus(id, newStatus, userId) {
  const validTransitions = {
    OPEN: ["VALIDATING"],
    VALIDATING: ["CALCULATING", "OPEN"],
    CALCULATING: ["LOCKED", "VALIDATING"],
    LOCKED: ["PUBLISHED", "REOPENED"],
    PUBLISHED: ["REOPENED"],
    REOPENED: ["VALIDATING", "LOCKED"],
  };

  const period = await getPeriodById(id);
  const allowed = validTransitions[period.status] || [];

  if (!allowed.includes(newStatus)) {
    throw new CustomError(`Invalid transition from ${period.status} to ${newStatus}`, 400);
  }

  await period.update({ status: newStatus, updated_by: userId });
  return period;
}

/**
 * Validate a period (check invoices and receipts)
 */
async function validatePeriod(id) {
  const period = await getPeriodById(id);

  if (period.status == 'OPEN' || period.status == 'REOPENED'){

    const missingInvoices = await Invoice.count({
      where: {
        issue_date: { [Op.between]: [period.start_date, period.end_date] },
        period_id: null,
      },
    });
  
    const missingReceipts = await Receipt.count({
      where: {
        payment_date: { [Op.between]: [period.start_date, period.end_date] },
        period_id: null,
      },
    });
  
    if (missingInvoices > 0 || missingReceipts > 0) {
      throw new CustomError(
        `Validation failed: ${missingInvoices} invoices and ${missingReceipts} receipts have no period assigned`,
        400
      );
    }
  
    await period.update({ status: "VALIDATING" });
    return { message: "Validation successful", period };
  } else {
    throw new CustomError(`Invalid transition from ${period.status} to VALIDATING`, 400);
  }

}

/**
 * Calculate period totals via stored procedure
 */
async function calculatePeriod(id, userId) {
  const period = await getPeriodById(id);

  if (!["VALIDATING", "OPEN", "REOPENED"].includes(period.status)) {
    throw new CustomError(
      `Period must be in VALIDATING, OPEN or REOPENED to calculate. Current: ${period.status}`,
      400
    );
  }

  await period.update({ status: "CALCULATING", updated_by: userId });

  const sql = "CALL sp_calculate_trial_balance(:p_period_id, :p_user_id)";
  const [resultSets] = await sequelize.query(sql, {
    replacements: { p_period_id: id, p_user_id: userId },
  });

  let totalsRow = null;
  if (Array.isArray(resultSets)) {
    if (Array.isArray(resultSets[0]) && resultSets[0].length > 0) {
      totalsRow = resultSets[0][0];
    } else if (resultSets.length > 0 && typeof resultSets[0] === "object") {
      totalsRow = resultSets[0];
    }
  } else if (resultSets && typeof resultSets === "object") {
    totalsRow = resultSets;
  }

  const totalDebits = totalsRow ? parseFloat(totalsRow.total_debits || 0) : 0;
  const totalCredits = totalsRow ? parseFloat(totalsRow.total_credits || 0) : 0;

  return {
    message: "Calculation completed",
    totals: { totalDebits, totalCredits },
    period: await getPeriodById(id),
  };
}

/**
 * Lock a validated/calculated period
 */
async function lockPeriod(id, userId) {
  const period = await getPeriodById(id);

  if (!["CALCULATING"].includes(period.status)) {
    throw new CustomError("Only a CALCULATING or VALIDATING period can be locked", 400);
  }

  const [totals] = await sequelize.query(
    `SELECT COALESCE(SUM(total_debit),0) AS total_debits, 
            COALESCE(SUM(total_credit),0) AS total_credits
     FROM trial_balances WHERE period_id = :periodId`,
    { replacements: { periodId: id }, type: sequelize.QueryTypes.SELECT }
  );

  const totalDebits = parseFloat(totals.total_debits || 0);
  const totalCredits = parseFloat(totals.total_credits || 0);

  if (Math.abs(totalDebits - totalCredits) > 0.01) {
    throw new CustomError(
      `Cannot lock period: debits (${totalDebits}) do not equal credits (${totalCredits})`,
      400
    );
  }

  await period.update({ status: "LOCKED", updated_by: userId });
  return {
    message: "Period locked successfully",
    period: await getPeriodById(id),
    totals: { totalDebits, totalCredits },
  };
}

module.exports = {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  changeStatus,
  validatePeriod,
  calculatePeriod,
  lockPeriod,
};
