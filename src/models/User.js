// Ruta: src/models/User.js
const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute(
      'SELECT *, id_usuario AS id, password_hash AS password FROM usuarios WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.execute(
      'SELECT id_usuario, id_usuario AS id, nombre, email, fecha_registro FROM usuarios WHERE id_usuario = ?',
      [id]
    );
    return rows[0] || null;
  }

  static async create({ nombre, email, password }) {
    const [result] = await db.execute(
      'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
      [nombre, email, password]
    );
    return { id_usuario: result.insertId, id: result.insertId, nombre, email };
  }
}

module.exports = User;
