const express = require('express');
const jwt = require('jsonwebtoken');
const { Transaction, Household, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { sendError } = require('../utils/errorHandler');
const router = express.Router();
const { Op } = require('sequelize');

const verifyHouseholdAccess = async (userId, householdId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Household, through: { attributes: [] } }]
  });
  return user?.Households?.some((h) => h.id === parseInt(householdId, 10));
};

// Shared aggregation logic used by both the authenticated monthly report
// and the public shared-report view.
const buildMonthlySummary = async (householdId, month) => {
  const startDate = new Date(`${month}-01`);
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0, 23, 59, 59);

  const transactions = await Transaction.findAll({
    where: {
      householdId,
      date: { [Op.between]: [startDate, endDate] }
    },
    include: [{ model: User, attributes: ['id', 'name'] }],
    order: [['date', 'ASC']]
  });

  const incomeTransactions = transactions.filter((t) => t.type === 'income');
  const expenseTransactions = transactions.filter((t) => t.type === 'expense');

  const totalIncome = incomeTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + parseFloat(t.amount), 0);
  const netBalance = totalIncome - totalExpense;

  const categoryBreakdown = expenseTransactions.reduce((acc, t) => {
    const existing = acc.find((item) => item.category === t.category);
    if (existing) {
      existing.total += parseFloat(t.amount);
    } else {
      acc.push({ category: t.category, total: parseFloat(t.amount) });
    }
    return acc;
  }, []);

  return {
    month,
    totalIncome,
    totalExpense,
    netBalance,
    transactionCount: transactions.length,
    categoryBreakdown,
    transactions
  };
};

// GET monthly summary for a household (authenticated, must be a member)
router.get('/monthly/:month', authMiddleware, async (req, res) => {
  try {
    const { month } = req.params;
    const { householdId } = req.query;

    if (!householdId) {
      return res.status(400).json({ error: 'householdId query param is required' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const summary = await buildMonthlySummary(householdId, month);
    res.json({ success: true, ...summary });
  } catch (err) {
    sendError(res, err);
  }
});

// POST create a shareable link for a given household + month.
// Encodes the grant in a signed JWT so no extra DB table is needed;
// the token itself IS the "share record" and can't be forged without JWT_SECRET.
router.post('/share', authMiddleware, async (req, res) => {
  try {
    const { householdId, month } = req.body;

    if (!householdId || !month) {
      return res.status(400).json({ error: 'householdId and month are required' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, householdId);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const token = jwt.sign(
      { householdId: parseInt(householdId, 10), month, purpose: 'share' },
      process.env.JWT_SECRET,
      { expiresIn: '90d' }
    );

    const shareUrl = `${process.env.FRONTEND_URL}/shared/${token}`;
    res.json({ success: true, token, shareUrl });
  } catch (err) {
    sendError(res, err);
  }
});

// GET a shared report — PUBLIC, no auth. Only reachable with a valid
// share token, and only ever exposes one household's one-month summary.
router.get('/shared/:token', async (req, res) => {
  try {
    const { token } = req.params;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(403).json({ error: 'This share link is invalid or has expired' });
    }

    if (decoded.purpose !== 'share') {
      return res.status(403).json({ error: 'Invalid share token' });
    }

    const household = await Household.findByPk(decoded.householdId, {
      attributes: ['id', 'name', 'currency']
    });

    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    const summary = await buildMonthlySummary(decoded.householdId, decoded.month);
    res.json({ success: true, household, ...summary });
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = router;
