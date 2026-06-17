// Ruta: src/models/UserPlant.js
const db = require('../config/db');

class UserPlant {
    /**
     * Registra una planta en la colección del usuario.
     * @param {Object} data - Datos de la planta del usuario.
     * @returns {Promise<Object>} La planta registrada.
     */
    static async create(data) {
        const { user_id, plant_id, custom_name, acquired_at, last_watered_at, is_favorite, status } = data;
        const sql = `
            INSERT INTO plantas_usuario (user_id, plant_id, custom_name, acquired_at, last_watered_at, is_favorite, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            user_id,
            plant_id,
            custom_name || null,
            acquired_at || null,
            last_watered_at || null,
            is_favorite !== undefined ? is_favorite : false,
            status || 'Activa'
        ]);
        return { id: result.insertId, ...data };
    }

    /**
     * Obtiene todas las plantas de un usuario.
     * @param {number} user_id - ID del usuario.
     * @returns {Promise<Array>} Listado de plantas del usuario.
     */
    static async findAllByUser(user_id) {
        const sql = `
            SELECT up.*, cp.nombre_cientifico, cp.nombre_comun, cp.descripcion, cp.imagen_url, cp.frecuencia_riego_dias
            FROM plantas_usuario up
            JOIN catalogo_plantas cp ON up.plant_id = cp.id_catalogo
            WHERE up.user_id = ?
        `;
        const [rows] = await db.execute(sql, [user_id]);
        return rows;
    }

    /**
     * Busca una planta específica de la colección.
     * @param {number} id - ID de la planta del usuario.
     * @returns {Promise<Object|null>} La planta del usuario o null si no se encuentra.
     */
    static async findById(id) {
        const sql = `
            SELECT up.*, cp.nombre_cientifico, cp.nombre_comun, cp.descripcion, cp.imagen_url, cp.frecuencia_riego_dias
            FROM plantas_usuario up
            JOIN catalogo_plantas cp ON up.plant_id = cp.id_catalogo
            WHERE up.id = ?
        `;
        const [rows] = await db.execute(sql, [id]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Actualiza información de una planta registrada.
     * @param {number} id - ID de la planta a actualizar.
     * @param {Object} data - Nuevos datos.
     * @returns {Promise<Object>} La planta actualizada.
     */
    static async update(id, data) {
        const { custom_name, acquired_at, last_watered_at, is_favorite, status } = data;
        const sql = `
            UPDATE plantas_usuario
            SET custom_name = ?, acquired_at = ?, last_watered_at = ?, is_favorite = ?, status = ?
            WHERE id = ?
        `;
        await db.execute(sql, [
            custom_name !== undefined ? custom_name : null,
            acquired_at !== undefined ? acquired_at : null,
            last_watered_at !== undefined ? last_watered_at : null,
            is_favorite !== undefined ? is_favorite : false,
            status !== undefined ? status : 'Activa',
            id
        ]);
        return this.findById(id);
    }

    /**
     * Elimina una planta de la colección.
     * @param {number} id - ID de la planta a eliminar.
     * @returns {Promise<boolean>} True si fue eliminada, false de lo contrario.
     */
    static async delete(id) {
        const sql = 'DELETE FROM plantas_usuario WHERE id = ?';
        const [result] = await db.execute(sql, [id]);
        return result.affectedRows > 0;
    }
}

module.exports = UserPlant;
