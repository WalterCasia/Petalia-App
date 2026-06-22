// Ruta: src/controllers/userPlantController.js
const UserPlant = require('../models/UserPlant');
const Plant = require('../models/Plant');

/**
 * Agrega una planta a la colección personal del usuario autenticado.
 */
exports.addUserPlant = async (req, res, next) => {
    try {
        const userId = req.user.id_usuario || req.user.id;
        const { id_catalogo, nombre_personalizado, fecha_adquisicion, fecha_ultimo_riego, favorita, estado, descripcion_personal, frecuencia_riego_dias } = req.body;

        if (!id_catalogo) {
            return res.status(400).json({ message: 'El id_catalogo es obligatorio' });
        }

        // Reutilizar el modelo Plant del catálogo para validar existencia
        const plantExists = await Plant.findById(id_catalogo);
        if (!plantExists) {
            return res.status(404).json({ message: 'La planta no existe en el catálogo general' });
        }

        // Handle uploaded photo or assign default catalog image
        let imagen_url = null;
        if (req.file) {
            imagen_url = `/uploads/${req.file.filename}`;
        } else {
            imagen_url = plantExists.imagen_url;
        }

        const newUserPlant = await UserPlant.create({
            id_usuario: userId,
            id_catalogo: parseInt(id_catalogo, 10),
            nombre_personalizado,
            fecha_adquisicion,
            fecha_ultimo_riego,
            favorita: favorita !== undefined ? (favorita === 'true' || favorita === true || favorita === 1) : false,
            estado: estado || 'Activa',
            imagen_url,
            descripcion_personal,
            frecuencia_riego_dias: frecuencia_riego_dias !== undefined && frecuencia_riego_dias !== '' ? parseInt(frecuencia_riego_dias, 10) : null
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
        return res.status(200).json(collection);
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
        if (userPlant.user_id !== userId && userPlant.id_usuario !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para ver esta planta' });
        }

        return res.status(200).json(userPlant);
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
        if (userPlant.user_id !== userId && userPlant.id_usuario !== userId) {
            return res.status(403).json({ message: 'No tienes permisos para modificar esta planta' });
        }

        // Handle uploaded photo if exists
        let updateData = { ...req.body };
        if (req.file) {
            updateData.imagen_url = `/uploads/${req.file.filename}`;
        }

        const updatedUserPlant = await UserPlant.update(id, updateData);
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
        if (userPlant.user_id !== userId && userPlant.id_usuario !== userId) {
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
