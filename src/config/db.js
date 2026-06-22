// Ruta: src/config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'petalia_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Auto-migration to ensure needed columns exist in 'plantas_usuario'
async function checkAndMigrateSchema() {
  try {
    const connection = await pool.getConnection();
    
    const [columnsDesc] = await connection.query(
      "SHOW COLUMNS FROM plantas_usuario LIKE 'descripcion_personal'"
    );
    if (columnsDesc.length === 0) {
      console.log('[Auto-Migration] Adding descripcion_personal column to table plantas_usuario...');
      await connection.query(
        "ALTER TABLE plantas_usuario ADD COLUMN descripcion_personal TEXT NULL"
      );
    }

    const [columnsFreq] = await connection.query(
      "SHOW COLUMNS FROM plantas_usuario LIKE 'frecuencia_riego_dias'"
    );
    if (columnsFreq.length === 0) {
      console.log('[Auto-Migration] Adding frecuencia_riego_dias column to table plantas_usuario...');
      await connection.query(
        "ALTER TABLE plantas_usuario ADD COLUMN frecuencia_riego_dias INT NULL"
      );
    }

    // Auto-create 'api_logs' table if it does not exist
    const [tableLogs] = await connection.query(
      "SHOW TABLES LIKE 'api_logs'"
    );
    if (tableLogs.length === 0) {
      console.log('[Auto-Migration] Creating table api_logs...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS api_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          endpoint_consultado VARCHAR(500) NOT NULL,
          codigo_estado INT NOT NULL,
          tiempo_respuesta_ms INT NOT NULL,
          fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
      `);
    }

    connection.release();
  } catch (err) {
    console.error('[Auto-Migration] Error checking/migrating schema:', err.message);
  }
}

checkAndMigrateSchema();

module.exports = pool;
