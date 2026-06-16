// Ruta: src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      const error = new Error('Access denied. No token provided.');
      error.status = 401;
      return next(error);
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretjwtkeyforpetalia');

    const user = await User.findById(decoded.id);
    if (!user) {
      const error = new Error('Invalid token. User not found.');
      error.status = 401;
      return next(error);
    }

    req.user = user;
    next();
  } catch (error) {
    const err = new Error('Invalid or expired token.');
    err.status = 401;
    next(err);
  }
};

module.exports = authMiddleware;
