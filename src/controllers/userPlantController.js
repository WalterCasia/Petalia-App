// Ruta: src/controllers/userPlantController.js
const UserPlant = require('../models/UserPlant');
const Plant = require('../models/Plant');

/**
 * Agrega una planta a la colección personal del usuario autenticado.
 */
exports.addUserPlant = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { plant_id, custom_name, acquired_at, last_watered_at, is_favorite, status } = req.body;

        if (!plant_id) {
            return res.status(400).json({ message: 'El plant_id es obligatorio' });
        }

        // Reutilizar el modelo Plant del catálogo para validar existencia
        const plantExists = await Plant.findById(plant_id);
        if (!plantExists) {
            return res.status(404).json({ message: 'La planta no existe en el catálogo general' });
        }

        const newUserPlant = await UserPlant.create({
            user_id: userId,
            plant_id,
            custom_name,
            acquired_at,
            last_watered_at,
            is_favorite: is_favorite !== undefined ? is_favorite : false,
            status: status || 'Activa'
        });

        return res.status(201).json({
            message: 'Planta agregada a la colección exitosamente',
            data: newUserPlant
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Obtiene el listado completo de la colección del usuario autenticado.
 */
exports.getplantas_usuario = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const collection = await UserPlant.findAllByUser(userId);
        return res.status(200).json({
            data: collection
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Obtiene una planta específica de la colección por su ID.
 */
exports.getUserPlantById = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { id } = req.params;

        const userPlant = await UserPlant.findById(id);
        if (!userPlant) {
            return res.status(404).json({ message: 'Planta no encontrada en la colección' });
        }

        // Garantizar que cada usuario solo acceda a sus propios registros
        if (userPlant.user_id !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para ver esta planta' });
        }

        return res.status(200).json({
            data: userPlant
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Actualiza los datos de una planta específica de la colección.
 */
exports.updateUserPlant = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { id } = req.params;

        const userPlant = await UserPlant.findById(id);
        if (!userPlant) {
            return res.status(404).json({ message: 'Planta no encontrada en la colección' });
        }

        // Garantizar que cada usuario solo modifique sus propios registros
        if (userPlant.user_id !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para modificar esta planta' });
        }

        const updatedUserPlant = await UserPlant.update(id, req.body);
        return res.status(200).json({
            message: 'Planta de la colección actualizada exitosamente',
            data: updatedUserPlant
        });
    } catch (error) {
        return next(error);
    }
};

/**
 * Elimina una planta específica de la colección.
 */
exports.deleteUserPlant = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { id } = req.params;

        const userPlant = await UserPlant.findById(id);
        if (!userPlant) {
            return res.status(404).json({ message: 'Planta no encontrada en la colección' });
        }

        // Garantizar que cada usuario solo elimine sus propios registros
        if (userPlant.user_id !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar esta planta' });
        }

        await UserPlant.delete(id);
        return res.status(200).json({
            message: 'Planta eliminada de la colección exitosamente'
        });
    } catch (error) {
        return next(error);
    }
};
