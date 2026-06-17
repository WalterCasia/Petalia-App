// Ruta: src/routes/userPlantRoutes.js
const express = require('express');
const router = express.Router();
const userPlantController = require('../controllers/userPlantController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas de este router
router.use(authMiddleware);

// Rutas de colección personal de plantas
router.post('/', userPlantController.addUserPlant);
router.get('/', userPlantController.getplantas_usuario);
router.get('/:id', userPlantController.getUserPlantById);
router.put('/:id', userPlantController.updateUserPlant);
router.delete('/:id', userPlantController.deleteUserPlant);

module.exports = router;
