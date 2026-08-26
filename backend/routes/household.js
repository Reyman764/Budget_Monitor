const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Household, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { sendError } = require('../utils/errorHandler');
const router = express.Router();

// Starting point for a new household's category list — the user can freely
// add to or delete from this afterward via PUT /:id/categories.
const DEFAULT_CATEGORIES = {
  expense: ['Food', 'Transport', 'Bills', 'Entertainment', 'Shopping', 'Health', 'Other'],
  income: ['Salary', 'Freelance', 'Business', 'Investment', 'Gift', 'Saving', 'Other']
};

// Shared helper — checks the requesting user belongs to the given household.
const verifyHouseholdAccess = async (userId, householdId) => {
  const user = await User.findByPk(userId, {
    include: [{ model: Household, through: { attributes: [] } }]
  });
  return user?.Households?.some((h) => h.id === parseInt(householdId, 10));
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, currency } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Household name is required' });
    }

    const inviteCode = uuidv4().slice(0, 8).toUpperCase();

    const household = await Household.create({
      name,
      currency: currency || 'NPR',
      createdBy: req.userId,
      inviteCode,
      categories: DEFAULT_CATEGORIES
    });

    await household.addUser(req.userId);

    res.status(201).json({
      success: true,
      household,
      inviteCode
    });
  } catch (err) {
    sendError(res, err);
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      include: [{
        model: Household,
        attributes: ['id', 'name', 'currency', 'createdBy', 'inviteCode', 'categories', 'createdAt'],
        through: { attributes: [] }
      }]
    });

    const household = user?.Households?.[0];

    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    res.json({ success: true, household });
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/join', authMiddleware, async (req, res) => {
  try {
    const { inviteCode } = req.body;

    if (!inviteCode) {
      return res.status(400).json({ error: 'Invite code is required' });
    }

    const household = await Household.findOne({
      where: { inviteCode: inviteCode.toUpperCase() }
    });

    if (!household) {
      return res.status(404).json({ error: 'Invalid invite code' });
    }

    const user = await User.findByPk(req.userId, {
      include: [{ model: Household, through: { attributes: [] } }]
    });

    const alreadyMember = user.Households.some(h => h.id === household.id);
    if (alreadyMember) {
      return res.status(409).json({ error: 'You are already a member of this household' });
    }

    await household.addUser(req.userId);

    res.json({
      success: true,
      message: 'Joined household',
      household
    });
  } catch (err) {
    sendError(res, err);
  }
});

// PUT /api/household/:id/categories
// Body: { categories: { expense: [...], income: [...] } }
// Replaces the household's whole category list — the frontend computes the
// add/delete locally and sends the resulting full list back.
router.put('/:id/categories', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { categories } = req.body;

    if (
      !categories ||
      typeof categories !== 'object' ||
      !Array.isArray(categories.expense) ||
      !Array.isArray(categories.income)
    ) {
      return res.status(400).json({ error: 'categories must be { expense: [...], income: [...] }' });
    }

    const hasAccess = await verifyHouseholdAccess(req.userId, id);
    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied to this household' });
    }

    const household = await Household.findByPk(id);
    if (!household) {
      return res.status(404).json({ error: 'Household not found' });
    }

    // Trim, drop blanks, de-dupe (case-insensitive), keep at least one
    // category per type, and cap the list at a sane length.
    const clean = (arr) => {
      const seen = new Set();
      const result = [];
      for (const raw of arr) {
        const name = String(raw).trim();
        if (!name) continue;
        const key = name.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        result.push(name);
      }
      return result.slice(0, 40);
    };

    const cleaned = {
      expense: clean(categories.expense),
      income: clean(categories.income)
    };

    if (cleaned.expense.length === 0 || cleaned.income.length === 0) {
      return res.status(400).json({ error: 'Each category list needs at least one category' });
    }

    await household.update({ categories: cleaned });

    res.json({ success: true, household });
  } catch (err) {
    sendError(res, err);
  }
});

module.exports = router;
