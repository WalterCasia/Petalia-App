// Ruta: src/models/User.js
const db = require('../config/db');

class User {
  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT id, username, email, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  }

  static async create({ username, email, password }) {
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );
    return { id: result.insertId, username, email };
  }
}

module.exports = User;
