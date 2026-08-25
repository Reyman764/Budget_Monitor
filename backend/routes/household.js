const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Household, User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');
const { sendError } = require('../utils/errorHandler');
const router = express.Router();

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
      inviteCode
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
        attributes: ['id', 'name', 'currency', 'createdBy', 'inviteCode', 'createdAt'],
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

module.exports = router;
