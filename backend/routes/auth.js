const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { User } = require('../models');
const { sendError } = require('../utils/errorHandler');
const router = express.Router();

const mailer = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
    })
  : null;

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name required' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      passwordHash,
      name
    });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    sendError(res, err);
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const message = 'If an account exists for that email, a password reset link has been sent.';
    if (!email) return res.json({ message });

    const user = await User.findOne({ where: { email } });
    if (user) {
      const rawToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
      await user.update({
        resetTokenHash: tokenHash,
        resetTokenExpiresAt: new Date(Date.now() + 60 * 60 * 1000)
      });

      const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
      if (!mailer || !process.env.SMTP_FROM) {
        console.error('Password reset email is not configured. Set SMTP_* environment variables.');
      } else {
        await mailer.sendMail({
          from: process.env.SMTP_FROM,
          to: user.email,
          subject: 'Reset your Budget password',
          text: `Reset your password using this link (valid for 1 hour): ${resetUrl}`
        });
      }
    }
    return res.json({ message });
  } catch (err) {
    return sendError(res, err);
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 6) {
      return res.status(400).json({ error: 'A valid token and a password of at least 6 characters are required' });
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ where: { resetTokenHash: tokenHash } });
    if (!user || !user.resetTokenExpiresAt || user.resetTokenExpiresAt <= new Date()) {
      return res.status(400).json({ error: 'This reset link is invalid or has expired' });
    }

    await user.update({
      passwordHash: await bcrypt.hash(password, 10),
      resetTokenHash: null,
      resetTokenExpiresAt: null
    });
    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    return sendError(res, err);
  }
});

module.exports = router;
