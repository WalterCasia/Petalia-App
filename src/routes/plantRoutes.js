// Ruta: src/routes/plantRoutes.js
const express = require('express');
const router = express.Router();
const plantController = require('../controllers/plantController');

router.get('/', plantController.getAllPlants);
router.get('/:id', plantController.getPlantById);

module.exports = router;
