// Ruta: src/models/Favorite.js
const db = require('../config/db');

class Favorite {
    /**
     * Helper to get id_catalogo from id_planta_usuario
     */
    static async getCatalogId(id_planta_usuario) {
        const [rows] = await db.execute(
            'SELECT id_catalogo FROM plantas_usuario WHERE id_planta_usuario = ?',
            [id_planta_usuario]
        );
        return rows.length > 0 ? rows[0].id_catalogo : null;
    }

    /**
     * Agrega una planta a los favoritos del usuario.
     * @param {number} id_usuario - ID del usuario.
     * @param {number} id_planta_usuario - ID de la planta del usuario.
     * @returns {Promise<Object>} El favorito registrado.
     */
    static async addFavorite(id_usuario, id_planta_usuario) {
        const id_catalogo = await this.getCatalogId(id_planta_usuario);
        if (!id_catalogo) {
            throw new Error('User plant not found');
        }

        // Insert into favoritos (avoiding duplicates if possible)
        const sql = 'INSERT IGNORE INTO favoritos (id_usuario, id_catalogo) VALUES (?, ?)';
        const [result] = await db.execute(sql, [id_usuario, id_catalogo]);

        // Update favorited state in plantas_usuario
        await db.execute(
            'UPDATE plantas_usuario SET favorita = TRUE WHERE id_planta_usuario = ?',
            [id_planta_usuario]
        );

        return { id: result.insertId, id_usuario, id_catalogo, id_planta_usuario };
    }

    /**
     * Elimina una planta de los favoritos del usuario.
     * @param {number} id_usuario - ID del usuario.
     * @param {number} id_planta_usuario - ID de la planta del usuario.
     * @returns {Promise<boolean>} True si fue eliminado, false de lo contrario.
     */
    static async removeFavorite(id_usuario, id_planta_usuario) {
        const id_catalogo = await this.getCatalogId(id_planta_usuario);
        if (!id_catalogo) {
            return false;
        }

        const sql = 'DELETE FROM favoritos WHERE id_usuario = ? AND id_catalogo = ?';
        const [result] = await db.execute(sql, [id_usuario, id_catalogo]);

        // Update favorited state in plantas_usuario
        await db.execute(
            'UPDATE plantas_usuario SET favorita = FALSE WHERE id_planta_usuario = ?',
            [id_planta_usuario]
        );

        return result.affectedRows > 0;
    }

    /**
     * Obtiene el listado completo de favoritos del usuario autenticado.
     * @param {number} id_usuario - ID del usuario.
     * @returns {Promise<Array>} Listado de favoritos con datos de catalogo.
     */
    static async getUserfavoritos(id_usuario) {
        const sql = `
            SELECT f.*, cp.nombre_cientifico, cp.nombre_comun, cp.descripcion, cp.imagen_url, cp.frecuencia_riego_dias
            FROM favoritos f
            JOIN catalogo_plantas cp ON f.id_catalogo = cp.id_catalogo
            WHERE f.id_usuario = ?
        `;
        const [rows] = await db.execute(sql, [id_usuario]);
        return rows;
    }

    /**
     * Verifica si una planta ya se encuentra marcada como favorita por el usuario.
     * @param {number} id_usuario - ID del usuario.
     * @param {number} id_planta_usuario - ID de la planta.
     * @returns {Promise<boolean>} True si existe en favoritos, false de lo contrario.
     */
    static async exists(id_usuario, id_planta_usuario) {
        const id_catalogo = await this.getCatalogId(id_planta_usuario);
        if (!id_catalogo) return false;

        const sql = 'SELECT 1 FROM favoritos WHERE id_usuario = ? AND id_catalogo = ? LIMIT 1';
        const [rows] = await db.execute(sql, [id_usuario, id_catalogo]);
        return rows.length > 0;
    }
}

module.exports = Favorite;
