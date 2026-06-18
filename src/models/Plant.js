// Ruta: src/models/Plant.js
const db = require('../config/db');

class Plant {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM plants');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM plants WHERE id = ?', [id]);
    return rows[0] || null;
  }
}

module.exports = Plant;
