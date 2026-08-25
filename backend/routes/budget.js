const express = require('express');
const { BudgetLimit, SavingsGoal, Transaction, Household, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { sendError } = require('../utils/errorHandler');
const router = express.Router();
const { Op } = require('sequelize');

const MONTH_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;
const currentMonth = () => new Date().toISOString().slice(0, 7);

// Shared helper — checks the requesting user belongs to the given household.
// Same pattern as transactions.js / reports.js.
const verifyHouseholdAccess = async (userId, householdId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Household, through: { attributes: [] } }]
  });
  return user?.Households?.some((h) => h.id === parseInt(householdId, 10));
};

// Start/end Date objects covering a "YYYY-MM" month (inclusive), same
// boundary math used in transactions.js and reports.js.
const monthRange = (month) => {
  const start = new Date(`${month}-01`);
  const end = new Date(start.getFullYear(), start.getMonth() + 1, 0, 23, 59, 59);
  return { start, end };
};

// POST /api/budget/limit — set (create or update) a category's monthly budget limit
router.post('/limit', authMiddleware, async (req, res) => {
  try {
    const { householdId, category, limitAmount, month } = req.body;

    if (!householdId || !category || limitAmount === undefined || limitAmount === null || limitAmount === '') {
      return res.status(400).json({ error: 'householdId, category, and limitAmount are required' });
    }

    if (isNaN(limitAmount) || parseFloat(limitAmount) <= 0) {
      return res.status(400).json({ error: 'limitAmount must be a positive number' });
    }

    const targetMonth = month || currentMonth();
    if (!MONTH_REGEX.test(targetMonth)) {
      return res.status(400).json({ error: 'month must be in YYYY-MM format' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    // One limit per household + category + month — set again and it updates in place
    // rather than creating a duplicate row.
    const [limit, created] = await BudgetLimit.findOrCreate({
      where: { householdId: parseInt(householdId, 10), category, month: targetMonth },
      defaults: { limitAmount: parseFloat(limitAmount) }
    });

    if (!created) {
      await limit.update({ limitAmount: parseFloat(limitAmount) });
    }

    res.status(created ? 201 : 200).json({ success: true, limit });
  } catch (err) {
    sendError(res, err);
  }
});

// GET /api/budget/progress/:householdId?month=YYYY-MM — budget vs. actual spend per category
// (month optional, defaults to the current month). Powers the 80% alerts, the actual-vs-
// budgeted chart, and the category breakdown table.
router.get('/progress/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;
    const targetMonth = req.query.month || currentMonth();

    if (!MONTH_REGEX.test(targetMonth)) {
      return res.status(400).json({ error: 'month must be in YYYY-MM format' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const { start, end } = monthRange(targetMonth);
    const hId = parseInt(householdId, 10);

    const limits = await BudgetLimit.findAll({
      where: { householdId: hId, month: targetMonth },
      order: [['category', 'ASC']]
    });

    const budgets = [];
    for (const limit of limits) {
      // Sequelize returns aggregate sums as strings for DECIMAL columns (same reason
      // every .amount read elsewhere in this codebase goes through parseFloat).
      const spent = parseFloat(
        await Transaction.sum('amount', {
          where: {
            householdId: hId,
            category: limit.category,
            type: 'expense',
            date: { [Op.between]: [start, end] }
          }
        })
      ) || 0;

      const limitAmount = parseFloat(limit.limitAmount);
      const percentageUsed = limitAmount > 0 ? (spent / limitAmount) * 100 : 0;

      budgets.push({
        ...limit.toJSON(),
        spent,
        percentageUsed: Math.round(percentageUsed),
        remaining: limitAmount - spent,
        alert: percentageUsed >= 80
      });
    }

    res.json({ success: true, month: targetMonth, budgets });
  } catch (err) {
    sendError(res, err);
  }
});

// POST /api/budget/goal — create a savings goal
router.post('/goal', authMiddleware, async (req, res) => {
  try {
    const { householdId, goalName, targetAmount, deadline } = req.body;

    if (!householdId || !goalName || targetAmount === undefined || targetAmount === null || targetAmount === '') {
      return res.status(400).json({ error: 'householdId, goalName, and targetAmount are required' });
    }

    if (isNaN(targetAmount) || parseFloat(targetAmount) <= 0) {
      return res.status(400).json({ error: 'targetAmount must be a positive number' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const goal = await SavingsGoal.create({
      householdId: parseInt(householdId, 10),
      goalName,
      targetAmount: parseFloat(targetAmount),
      deadline: deadline || null
    });

    res.status(201).json({ success: true, goal });
  } catch (err) {
    sendError(res, err);
  }
});

// GET /api/budget/goal/:householdId — list all savings goals for a household
router.get('/goal/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const goals = await SavingsGoal.findAll({
      where: { householdId: parseInt(householdId, 10) },
      order: [['createdAt', 'DESC']]
    });

    res.json({ success: true, goals });
  } catch (err) {
    sendError(res, err);
  }
});

// PUT /api/budget/goal/:id — update a goal (name/target/deadline, or log progress via currentAmount)
router.put('/goal/:id', authMiddleware, async (req, res) => {
  try {
    const { goalName, targetAmount, currentAmount, deadline } = req.body;

    const goal = await SavingsGoal.findByPk(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    const hasAccess = await verifyHouseholdAccess(req.userId, goal.householdId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    if (targetAmount !== undefined && (isNaN(targetAmount) || parseFloat(targetAmount) <= 0)) {
      return res.status(400).json({ error: 'targetAmount must be a positive number' });
    }
    if (currentAmount !== undefined && (isNaN(currentAmount) || parseFloat(currentAmount) < 0)) {
      return res.status(400).json({ error: 'currentAmount cannot be negative' });
    }

    await goal.update({
      goalName: goalName !== undefined ? goalName : goal.goalName,
      targetAmount: targetAmount !== undefined ? parseFloat(targetAmount) : goal.targetAmount,
      currentAmount: currentAmount !== undefined ? parseFloat(currentAmount) : goal.currentAmount,
      deadline: deadline !== undefined ? deadline : goal.deadline
    });

    res.json({ success: true, goal });
  } catch (err) {
    sendError(res, err);
  }
});

// DELETE /api/budget/goal/:id
router.delete('/goal/:id', authMiddleware, async (req, res) => {
  try {
    const goal = await SavingsGoal.findByPk(req.params.id);
    if (!goal) return res.status(404).json({ error: 'Goal not found' });

    const hasAccess = await verifyHouseholdAccess(req.userId, goal.householdId);
    if (!hasAccess) return res.status(403).json({ error: 'Access denied' });

    await goal.destroy();
    res.json({ success: true, message: 'Goal deleted' });
  } catch (err) {
    sendError(res, err);
  }
});

// GET /api/budget/trends/:householdId — last 12 months of income/expense/net (oldest → newest)
router.get('/trends/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const hId = parseInt(householdId, 10);
    const now = new Date();
    const showAll = req.query.range === 'all';

    let rangeStart;
    if (showAll) {
      const earliestDate = await Transaction.min('date', { where: { householdId: hId } });
      rangeStart = earliestDate
        ? new Date(new Date(earliestDate).getFullYear(), new Date(earliestDate).getMonth(), 1)
        : new Date(now.getFullYear(), now.getMonth(), 1);
      // Safety cap so a household with years of history doesn't return an unbounded chart
      const oldestAllowed = new Date(now.getFullYear(), now.getMonth() - 59, 1);
      if (rangeStart < oldestAllowed) rangeStart = oldestAllowed;
    } else {
      rangeStart = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    }
    const rangeEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

    // One query for the whole window, then reduce by month in JS — same approach
    // reports.js uses for categoryBreakdown, and cheaper than one query per month.
    const transactions = await Transaction.findAll({
      where: { householdId: hId, date: { [Op.between]: [rangeStart, rangeEnd] } },
      attributes: ['amount', 'type', 'date']
    });

    const byMonth = transactions.reduce((acc, t) => {
      const key = new Date(t.date).toISOString().slice(0, 7);
      if (!acc[key]) acc[key] = { income: 0, expense: 0 };
      acc[key][t.type] += parseFloat(t.amount);
      return acc;
    }, {});

    const monthCount =
      (rangeEnd.getFullYear() - rangeStart.getFullYear()) * 12 + (rangeEnd.getMonth() - rangeStart.getMonth()) + 1;

    const trends = [];
    for (let i = 0; i < monthCount; i++) {
      const d = new Date(rangeStart.getFullYear(), rangeStart.getMonth() + i, 1);
      const key = d.toISOString().slice(0, 7);
      const entry = byMonth[key] || { income: 0, expense: 0 };
      trends.push({ month: key, income: entry.income, expense: entry.expense, net: entry.income - entry.expense });
    }

    res.json({ success: true, trends });
  } catch (err) {
    sendError(res, err);
  }
});

// GET /api/budget/networth/:householdId — all-time income minus all-time expenses
router.get('/networth/:householdId', authMiddleware, async (req, res) => {
  try {
    const { householdId } = req.params;

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const hId = parseInt(householdId, 10);
    const totalIncome = parseFloat(await Transaction.sum('amount', { where: { householdId: hId, type: 'income' } })) || 0;
    const totalExpense = parseFloat(await Transaction.sum('amount', { where: { householdId: hId, type: 'expense' } })) || 0;

    res.json({ success: true, totalIncome, totalExpense, netWorth: totalIncome - totalExpense });
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = router;
