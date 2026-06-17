// Ruta: src/models/Favorite.js
const db = require('../config/db');

class Favorite {
    /**
     * Agrega una planta a los favoritos del usuario.
     * @param {number} user_id - ID del usuario.
     * @param {number} plant_id - ID de la planta (id_catalogo).
     * @returns {Promise<Object>} El favorito registrado.
     */
    static async addFavorite(user_id, plant_id) {
        const sql = 'INSERT INTO favoritos (user_id, plant_id) VALUES (?, ?)';
        const [result] = await db.execute(sql, [user_id, plant_id]);
        return { id: result.insertId, user_id, plant_id };
    }

    /**
     * Elimina una planta de los favoritos del usuario.
     * @param {number} user_id - ID del usuario.
     * @param {number} plant_id - ID de la planta.
     * @returns {Promise<boolean>} True si fue eliminado, false de lo contrario.
     */
    static async removeFavorite(user_id, plant_id) {
        const sql = 'DELETE FROM favoritos WHERE user_id = ? AND plant_id = ?';
        const [result] = await db.execute(sql, [user_id, plant_id]);
        return result.affectedRows > 0;
    }

    /**
     * Obtiene el listado completo de favoritos del usuario autenticado.
     * @param {number} user_id - ID del usuario.
     * @returns {Promise<Array>} Listado de favoritos con datos de catalogo.
     */
    static async getUserfavoritos(user_id) {
        const sql = `
            SELECT f.*, cp.nombre_cientifico, cp.nombre_comun, cp.descripcion, cp.imagen_url, cp.frecuencia_riego_dias
            FROM favoritos f
            JOIN catalogo_plantas cp ON f.plant_id = cp.id_catalogo
            WHERE f.user_id = ?
        `;
        const [rows] = await db.execute(sql, [user_id]);
        return rows;
    }

    /**
     * Verifica si una planta ya se encuentra marcada como favorita por el usuario.
     * @param {number} user_id - ID del usuario.
     * @param {number} plant_id - ID de la planta.
     * @returns {Promise<boolean>} True si existe en favoritos, false de lo contrario.
     */
    static async exists(user_id, plant_id) {
        const sql = 'SELECT 1 FROM favoritos WHERE user_id = ? AND plant_id = ? LIMIT 1';
        const [rows] = await db.execute(sql, [user_id, plant_id]);
        return rows.length > 0;
    }
}

module.exports = Favorite;
