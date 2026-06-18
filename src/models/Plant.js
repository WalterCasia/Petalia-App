// Ruta: src/models/Plant.js
const db = require('../config/db');

class Plant {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM catalogo_plantas');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM catalogo_plantas WHERE id_catalogo = ?', [id]);
    return rows[0] || null;
  }

  static async search(query) {
    const sql = `
      SELECT * FROM catalogo_plantas 
      WHERE nombre_comun LIKE ? OR nombre_cientifico LIKE ?
    `;
    const [rows] = await db.execute(sql, [`%${query}%`, `%${query}%`]);
    return rows;
  }

  static async create(data) {
    const { id_catalogo, nombre_cientifico, nombre_comun, descripcion, frecuencia_riego_dias, luz_recomendada, temperatura_min, temperatura_max, imagen_url } = data;
    const sql = `
      INSERT IGNORE INTO catalogo_plantas (id_catalogo, nombre_cientifico, nombre_comun, descripcion, frecuencia_riego_dias, luz_recomendada, temperatura_min, temperatura_max, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.execute(sql, [
      id_catalogo,
      nombre_cientifico,
      nombre_comun || null,
      descripcion || null,
      frecuencia_riego_dias || 7,
      luz_recomendada || null,
      temperatura_min || null,
      temperatura_max || null,
      imagen_url || null
    ]);
    return this.findById(id_catalogo);
  }
}

module.exports = Plant;
