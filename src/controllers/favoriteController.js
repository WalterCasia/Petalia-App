// Ruta: src/controllers/favoriteController.js
const Favorite = require('../models/Favorite');
const UserPlant = require('../models/UserPlant');

/**
 * Marca una planta como favorita para el usuario autenticado.
 */
exports.addFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { id_planta_usuario, id_catalogo } = req.body;

        if (!id_planta_usuario && !id_catalogo) {
            return res.status(400).json({ message: 'El id_planta_usuario o id_catalogo es obligatorio' });
        }

        if (id_planta_usuario) {
            // Validar existencia de la planta en la colección del usuario
            const plantExists = await UserPlant.findById(id_planta_usuario);
            if (!plantExists) {
                return res.status(404).json({ message: 'La planta no existe en tu colección' });
            }

            // Evitar registros duplicados de favoritos para un mismo usuario
            const alreadyFavorite = await Favorite.exists(userId, id_planta_usuario);
            if (alreadyFavorite) {
                return res.status(400).json({ message: 'Esta planta ya está en tus favoritos' });
            }

            const newFavorite = await Favorite.addFavorite(userId, id_planta_usuario);
            return res.status(201).json({
                message: 'Planta agregada a favoritos exitosamente',
                data: newFavorite
            });
        } else {
            // Flujo de deseos del catálogo (favorito directo por id_catalogo)
            const alreadyFavorite = await Favorite.existsCatalog(userId, id_catalogo);
            if (alreadyFavorite) {
                return res.status(400).json({ message: 'Esta planta ya está en tus deseos' });
            }

            const newFavorite = await Favorite.addFavoriteCatalog(userId, id_catalogo);
            return res.status(201).json({
                message: 'Planta agregada a tus deseos exitosamente',
                data: newFavorite
            });
        }
    } catch (error) {
        return next(error);
    }
};

/**
 * Remueve una planta de los favoritos (o deseos) del usuario autenticado.
 */
exports.removeFavorite = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { plantId } = req.params; // Puede ser id_planta_usuario o id_catalogo

        if (!plantId) {
            return res.status(400).json({ message: 'El ID es obligatorio' });
        }

        // 1. Intentar buscar si corresponde a una de sus plantas de colección
        const userPlant = await UserPlant.findById(plantId);
        if (userPlant && (userPlant.user_id === userId || userPlant.id_usuario === userId)) {
            const favoriteExists = await Favorite.exists(userId, plantId);
            if (favoriteExists) {
                await Favorite.removeFavorite(userId, plantId);
                return res.status(200).json({
                    message: 'Planta eliminada de favoritos exitosamente'
                });
            }
        }

        // 2. Si no es de su colección, intentar remover directamente de favoritos por id_catalogo (deseos)
        const isCatalogFav = await Favorite.existsCatalog(userId, plantId);
        if (isCatalogFav) {
            await Favorite.removeFavoriteCatalog(userId, plantId);
            return res.status(200).json({
                message: 'Planta eliminada de deseos exitosamente'
            });
        }

        return res.status(404).json({ message: 'La planta no está marcada como favorita o deseo' });
    } catch (error) {
        return next(error);
    }
};

/**
 * Obtiene el listado completo de favoritos (deseos) del usuario autenticado.
 */
exports.getfavoritos = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const favoritos = await Favorite.getUserfavoritos(userId);
        return res.status(200).json(favoritos);
    } catch (error) {
        return next(error);
    }
};
