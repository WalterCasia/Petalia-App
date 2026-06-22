// Ruta: src/middlewares/adminMiddleware.js

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user || req.user.rol !== 'admin') {
      const error = new Error('Access denied. Administrator role required.');
      error.status = 403;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = adminMiddleware;
