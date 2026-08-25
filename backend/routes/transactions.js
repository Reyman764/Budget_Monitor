const express = require('express');
const { Transaction, Household, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { sendError } = require('../utils/errorHandler');
const router = express.Router();
const { Op } = require('sequelize');

// Shared helper — checks the requesting user belongs to the given household.
const verifyHouseholdAccess = async (userId, householdId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Household, through: { attributes: [] } }]
  });
  return user?.Households?.some((h) => h.id === parseInt(householdId, 10));
};

// POST /api/transactions  — create a transaction (income or expense, optionally recurring)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, description, date, householdId, isRecurring, recurringDay } = req.body;

    if (!amount || !type || !category || !householdId) {
      return res.status(400).json({ error: 'Amount, type, category, and householdId required' });
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be income or expense' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const transaction = await Transaction.create({
      amount: parseFloat(amount),
      type,
      category,
      description: description || '',
      date: date || new Date(),
      recordedBy: req.userId,
      householdId: parseInt(householdId, 10),
      status: 'confirmed',
      isRecurring: Boolean(isRecurring),
      recurringDay: isRecurring ? (recurringDay || null) : null
    });

    res.status(201).json({ success: true, transaction });
  } catch (err) {
    sendError(res, err);
  }
});

// POST /api/transactions/:householdId/carry-over
// Body: { month: "YYYY-MM" }
// Idempotently creates a "Remaining of previous month" transaction dated on
// the 1st of `month`, carrying over the previous month's net balance
// (income − expense, previous month's own carry-over included) so balances
// roll forward month to month. A positive balance lands as income/"Saving"
// (Money In); a negative balance lands as an expense/"Saving" so the deficit
// still carries forward correctly. Safe to call repeatedly — it never
// creates a second carry-over entry for the same month.
router.post('/:householdId/carry-over', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;
    const { month } = req.body;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ error: 'month must be in YYYY-MM format' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    // Only carry a balance into `month` once its previous month has fully
    // ended — i.e. `month` can't be later than the real current month.
    const realCurrentMonth = new Date().toISOString().slice(0, 7);
    if (month > realCurrentMonth) {
      return res.json({ success: true, created: false, reason: 'future-month' });
    }

    const monthRange = (m) => {
      const [y, mo] = m.split('-').map(Number);
      return {
        start: new Date(Date.UTC(y, mo - 1, 1, 0, 0, 0)),
        end: new Date(Date.UTC(y, mo, 0, 23, 59, 59, 999))
      };
    };

    const hId = parseInt(householdId, 10);
    const { start: monthStart } = monthRange(month);

    // Already carried over for this month? Don't duplicate.
    const existing = await Transaction.findOne({
      where: {
        householdId: hId,
        isCarryOver: true,
        date: { [Op.gte]: monthStart, [Op.lt]: new Date(monthStart.getTime() + 24 * 60 * 60 * 1000) }
      }
    });
    if (existing) {
      return res.json({ success: true, created: false, transaction: existing });
    }

    // Previous month string (UTC-safe, no local-timezone month rollover issues)
    const [y, mo] = month.split('-').map(Number);
    const prevDate = new Date(Date.UTC(y, mo - 2, 1));
    const prevMonth = `${prevDate.getUTCFullYear()}-${String(prevDate.getUTCMonth() + 1).padStart(2, '0')}`;
    const { start: prevStart, end: prevEnd } = monthRange(prevMonth);

    const prevTransactions = await Transaction.findAll({
      where: { householdId: hId, date: { [Op.between]: [prevStart, prevEnd] } }
    });

    if (prevTransactions.length === 0) {
      return res.json({ success: true, created: false, reason: 'no-previous-month-data' });
    }

    const netBalance = prevTransactions.reduce(
      (sum, t) => sum + (t.type === 'income' ? parseFloat(t.amount) : -parseFloat(t.amount)),
      0
    );

    if (netBalance === 0) {
      return res.json({ success: true, created: false, reason: 'zero-balance' });
    }

    const transaction = await Transaction.create({
      amount: Math.abs(netBalance),
      type: netBalance >= 0 ? 'income' : 'expense',
      category: 'Saving',
      description: 'Remaining of previous month',
      date: monthStart,
      recordedBy: req.userId,
      householdId: hId,
      status: 'confirmed',
      isRecurring: false,
      recurringDay: null,
      isCarryOver: true
    });

    res.status(201).json({ success: true, created: true, transaction });
  } catch (err) {
    sendError(res, err);
  }
});


// Supports: ?month=YYYY-MM, ?startDate=YYYY-MM-DD, ?endDate=YYYY-MM-DD,
//           ?type=income|expense, ?category=X, ?search=text, ?recurring=true
router.get('/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;
    const { month, startDate, endDate, type, category, search, recurring } = req.query;

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const where = { householdId: parseInt(householdId, 10) };

    // Date range: explicit startDate/endDate takes priority over month shorthand
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.date[Op.lte] = end;
      }
    } else if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
      where.date = { [Op.between]: [start, end] };
    }

    if (type && ['income', 'expense'].includes(type)) {
      where.type = type;
    }

    if (category) {
      where.category = category;
    }

    // Full-text search: match description or category (case-insensitive)
    if (search && search.trim()) {
      where[Op.or] = [
        { description: { [Op.iLike]: `%${search.trim()}%` } },
        { category: { [Op.iLike]: `%${search.trim()}%` } }
      ];
    }

    // Bill tracker filter — only recurring transactions
    if (recurring === 'true') {
      where.isRecurring = true;
    }

    const transactions = await Transaction.findAll({
      where,
      include: [{ model: User, attributes: ['id', 'name'] }],
      order: [['date', 'DESC']]
    });

    res.json({ success: true, transactions });
  } catch (err) {
    sendError(res, err);
  }
});

// PUT /api/transactions/:id  — update any field including recurring info
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { amount, type, category, description, date, isRecurring, recurringDay } = req.body;

    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    const hasAccess = await verifyHouseholdAccess(req.userId, transaction.householdId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({ error: 'Type must be income or expense' });
    }

    const updatedRecurring = isRecurring !== undefined ? Boolean(isRecurring) : transaction.isRecurring;

    await transaction.update({
      amount: amount !== undefined ? parseFloat(amount) : transaction.amount,
      type: type || transaction.type,
      category: category || transaction.category,
      description: description !== undefined ? description : transaction.description,
      date: date || transaction.date,
      isRecurring: updatedRecurring,
      recurringDay: updatedRecurring
        ? (recurringDay !== undefined ? recurringDay : transaction.recurringDay)
        : null
    });

    res.json({ success: true, transaction });
  } catch (err) {
    sendError(res, err);
  }
});

// POST /api/transactions/:id/pay — quickly log a one-off payment for a recurring bill
// Creates a new confirmed expense for today with the same category/amount/description,
// which shows up in this month's transaction list as "paid".
router.post('/:id/pay', authMiddleware, async (req, res) => {
  try {
    const bill = await Transaction.findByPk(req.params.id);
    if (!bill) return res.status(404).json({ error: 'Bill not found' });

    if (!bill.isRecurring) {
      return res.status(400).json({ error: 'This transaction is not a recurring bill' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, bill.householdId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    const payment = await Transaction.create({
      amount: bill.amount,
      type: 'expense',
      category: bill.category,
      description: `${bill.description || bill.category} (bill payment)`,
      date: new Date(),
      recordedBy: req.userId,
      householdId: bill.householdId,
      status: 'confirmed',
      isRecurring: false,
      recurringDay: null
    });

    res.status(201).json({ success: true, payment });
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /api/transactions/:id
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const transaction = await Transaction.findByPk(req.params.id);
    if (!transaction) return res.status(404).json({ error: 'Transaction not found' });

    const hasAccess = await verifyHouseholdAccess(req.userId, transaction.householdId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    await transaction.destroy();
    res.json({ success: true, message: 'Transaction deleted' });
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = router;
