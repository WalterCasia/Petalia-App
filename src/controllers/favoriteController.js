// Ruta: src/controllers/favoriteController.js
const Favorite = require('../models/Favorite');
const Plant = require('../models/Plant');

/**
 * Marca una planta como favorita para el usuario autenticado.
 */
exports.addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { plant_id } = req.body;

        if (!plant_id) {
            return res.status(400).json({ message: 'El plant_id es obligatorio' });
        }

        // Validar existencia de la planta en el catálogo general
        const plantExists = await Plant.findById(plant_id);
        if (!plantExists) {
            return res.status(404).json({ message: 'La planta no existe en el catálogo general' });
        }

        // Evitar registros duplicados de favoritos para un mismo usuario
        const alreadyFavorite = await Favorite.exists(userId, plant_id);
        if (alreadyFavorite) {
            return res.status(400).json({ message: 'Esta planta ya está en tus favoritos' });
        }

        const newFavorite = await Favorite.addFavorite(userId, plant_id);
        return res.status(201).json({
            message: 'Planta agregada a favoritos exitosamente',
            data: newFavorite
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Remueve una planta de los favoritos del usuario autenticado.
 */
exports.removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { plantId } = req.params;

        if (!plantId) {
            return res.status(400).json({ message: 'El plantId es obligatorio' });
        }

        // Verificar si la planta está marcada como favorita antes de removerla
        const favoriteExists = await Favorite.exists(userId, plantId);
        if (!favoriteExists) {
            return res.status(404).json({ message: 'La planta no está en tus favoritos' });
        }

        await Favorite.removeFavorite(userId, plantId);
        return res.status(200).json({
            message: 'Planta eliminada de favoritos exitosamente'
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Obtiene el listado completo de favoritos del usuario autenticado.
 */
exports.getfavoritos = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const favoritos = await Favorite.getUserfavoritos(userId);
        return res.status(200).json({
            data: favoritos
        });
    } catch (error) {
        return next(error);
    }
};
