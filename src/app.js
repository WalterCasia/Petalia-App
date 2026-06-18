// Ruta: src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const plantRoutes = require('./routes/plantRoutes');
const userPlantRoutes = require('./routes/userPlantRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const careRoutes = require('./routes/careRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded plant photos
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Serve frontend files
app.use(express.static(path.join(__dirname, '../public')));

// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/catalogo', plantRoutes);
app.use('/api/plantas', userPlantRoutes);
app.use('/api/favoritos', favoriteRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api', careRoutes); // Mounts /historial, /plantas/:id/regar, /plantas/:id/abonar, etc.

// 404 handler for unmatched API routes
app.use('/api', (req, res, next) => {
  const error = new Error('API route not found');
  error.status = 404;
  next(error);
});

// Fallback to serving index.html for frontend routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Global Error Handler
app.use(errorMiddleware);

module.exports = app;
