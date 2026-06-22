// Ruta: src/routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');
const adminController = require('../controllers/adminController');

// All admin routes require token authentication and admin role verification
router.use(authMiddleware);
router.use(adminMiddleware);

// User management endpoints
router.get('/usuarios', adminController.getUsers);
router.delete('/usuarios/:id', adminController.deleteUser);

// API logs endpoint
router.get('/logs', adminController.getApiLogs);

// Catalog plant management endpoints
router.get('/plantas', adminController.getCatalogPlants);
router.post('/plantas', adminController.createCatalogPlant);
router.put('/plantas/:id', adminController.updateCatalogPlant);
router.delete('/plantas/:id', adminController.deleteCatalogPlant);

module.exports = router;
