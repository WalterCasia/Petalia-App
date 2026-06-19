// Ruta: src/models/UserPlant.js
const db = require('../config/db');

class UserPlant {
    /**
     * Registra una planta en la colección del usuario.
     * @param {Object} data - Datos de la planta del usuario.
     * @returns {Promise<Object>} La planta registrada.
     */
    static async create(data) {
        const { id_usuario, id_catalogo, nombre_personalizado, fecha_adquisicion, fecha_ultimo_riego, favorita, estado, imagen_url, fecha_ultimo_abono } = data;
        const sql = `
            INSERT INTO plantas_usuario (id_usuario, id_catalogo, nombre_personalizado, fecha_adquisicion, fecha_ultimo_riego, favorita, estado, imagen_url, fecha_ultimo_abono)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.execute(sql, [
            id_usuario,
            id_catalogo,
            nombre_personalizado || null,
            fecha_adquisicion || null,
            fecha_ultimo_riego || null,
            favorita !== undefined ? favorita : false,
            estado || 'Activa',
            imagen_url || null,
            fecha_ultimo_abono || fecha_adquisicion || null
        ]);
        return {
            id_planta_usuario: result.insertId,
            id: result.insertId,
            id_usuario,
            user_id: id_usuario,
            id_catalogo,
            plant_id: id_catalogo,
            nombre_personalizado,
            fecha_adquisicion,
            fecha_ultimo_riego,
            favorita,
            estado,
            imagen_url,
            fecha_ultimo_abono
        };
    }

    /**
     * Obtiene todas las plantas de un usuario.
     * @param {number} id_usuario - ID del usuario.
     * @returns {Promise<Array>} Listado de plantas del usuario.
     */
    static async findAllByUser(id_usuario) {
        const sql = `
            SELECT 
                up.*, 
                up.id_usuario AS user_id,
                up.id_catalogo AS plant_id,
                cp.nombre_cientifico, 
                cp.nombre_comun, 
                cp.descripcion, 
                up.imagen_url AS imagen_url,
                cp.imagen_url AS catalog_imagen_url, 
                cp.frecuencia_riego_dias,
                cp.luz_recomendada,
                cp.temperatura_min,
                cp.temperatura_max
            FROM plantas_usuario up
            JOIN catalogo_plantas cp ON up.id_catalogo = cp.id_catalogo
            WHERE up.id_usuario = ?
        `;
        const [rows] = await db.execute(sql, [id_usuario]);
        return rows;
    }

    /**
     * Busca una planta específica de la colección.
     * @param {number} id_planta_usuario - ID de la planta del usuario.
     * @returns {Promise<Object|null>} La planta del usuario o null si no se encuentra.
     */
    static async findById(id_planta_usuario) {
        const sql = `
            SELECT 
                up.*, 
                up.id_usuario AS user_id,
                up.id_catalogo AS plant_id,
                cp.nombre_cientifico, 
                cp.nombre_comun, 
                cp.descripcion, 
                up.imagen_url AS imagen_url,
                cp.imagen_url AS catalog_imagen_url, 
                cp.frecuencia_riego_dias,
                cp.luz_recomendada,
                cp.temperatura_min,
                cp.temperatura_max
            FROM plantas_usuario up
            JOIN catalogo_plantas cp ON up.id_catalogo = cp.id_catalogo
            WHERE up.id_planta_usuario = ?
        `;
        const [rows] = await db.execute(sql, [id_planta_usuario]);
        return rows.length > 0 ? rows[0] : null;
    }

    /**
     * Actualiza información de una planta registrada.
     * @param {number} id_planta_usuario - ID de la planta a actualizar.
     * @param {Object} data - Nuevos datos.
     * @returns {Promise<Object>} La planta actualizada.
     */
    static async update(id_planta_usuario, data) {
        const { nombre_personalizado, fecha_adquisicion, fecha_ultimo_riego, favorita, estado, imagen_url, fecha_ultimo_abono } = data;

        // Build dynamic query to avoid overwriting fields with undefined
        const fields = [];
        const values = [];

        if (nombre_personalizado !== undefined) { fields.push('nombre_personalizado = ?'); values.push(nombre_personalizado); }
        if (fecha_adquisicion !== undefined) { fields.push('fecha_adquisicion = ?'); values.push(fecha_adquisicion); }
        if (fecha_ultimo_riego !== undefined) { fields.push('fecha_ultimo_riego = ?'); values.push(fecha_ultimo_riego); }
        if (favorita !== undefined) { fields.push('favorita = ?'); values.push(favorita); }
        if (estado !== undefined) { fields.push('estado = ?'); values.push(estado); }
        if (imagen_url !== undefined) { fields.push('imagen_url = ?'); values.push(imagen_url); }
        if (fecha_ultimo_abono !== undefined) { fields.push('fecha_ultimo_abono = ?'); values.push(fecha_ultimo_abono); }

        if (fields.length === 0) {
            return this.findById(id_planta_usuario);
        }

        const sql = `
            UPDATE plantas_usuario
            SET ${fields.join(', ')}
            WHERE id_planta_usuario = ?
        `;
        values.push(id_planta_usuario);

        await db.execute(sql, values);
        return this.findById(id_planta_usuario);
    }

    /**
     * Elimina una planta de la colección.
     * @param {number} id_planta_usuario - ID de la planta a eliminar.
     * @returns {Promise<boolean>} True si fue eliminada, false de lo contrario.
     */
    static async delete(id_planta_usuario) {
        const sql = 'DELETE FROM plantas_usuario WHERE id_planta_usuario = ?';
        const [result] = await db.execute(sql, [id_planta_usuario]);
        return result.affectedRows > 0;
    }
}

module.exports = UserPlant;
