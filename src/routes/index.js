// /src/routes/index.js
const express = require('express');
const router = express.Router();

const authRoutes = require('../auth/auth.routes');
const userRoutes = require('../auth/user.routes');
// sales route object
const customerRoutes = require('../domains/sales/customers/customer.routes');
const invoiceRoutes = require('../domains/sales/invoices/invoice.routes');
const receiptRoutes = require('../domains/sales/receipts/receipt.routes');

// accounting route object
const periodRoutes = require('../domains/accounting/periods/period.routes');
const accountRoutes = require('../domains/accounting/accounts/account.routes');
const journalEntryRoutes = require('../domains/accounting/journalEntries/journalEntry.routes');
const journalEntryLineRoutes = require('../domains/accounting/journalEntryLines/journalEntryLine.routes');

// auth routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

// sales domain base route
router.use('/sales/customers', customerRoutes);
router.use('/sales/invoices', invoiceRoutes);
router.use('/sales/receipts', receiptRoutes);

// accounting domain base route
router.use('/accounting/periods', periodRoutes);
router.use('/accounting/accounts', accountRoutes);
router.use('/accounting/journal-entries', journalEntryRoutes);
router.use('/accounting/journal-entry-lines', journalEntryLineRoutes);

module.exports = router;
