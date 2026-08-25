const jwt = require('jsonwebtoken');
const { User } = require('../models');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // A token can outlive the user it points to — e.g. the database was
    // reset/reseeded after the token was issued. Confirm the user still
    // exists here so a stale token fails cleanly with a clear message,
    // instead of surfacing later as a confusing foreign-key error.
    const user = await User.findByPk(decoded.id, { attributes: ['id', 'email'] });
    if (!user) {
      return res.status(401).json({ error: 'Session no longer valid. Please log in again.' });
    }

    req.userId = user.id;
    req.userEmail = user.email;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;
