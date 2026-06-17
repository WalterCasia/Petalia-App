// Ruta: src/routes/favoriteRoutes.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const authMiddleware = require('../middlewares/authMiddleware');

// Proteger todas las rutas de este router
router.use(authMiddleware);

// Rutas de favoritos
router.post('/', favoriteController.addFavorite);
router.delete('/:plantId', favoriteController.removeFavorite);
router.get('/', favoriteController.getfavoritos);

module.exports = router;
