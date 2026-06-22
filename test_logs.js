// Ruta: test_logs.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function runTest() {
  let connection;
  try {
    console.log('Connecting to database...');
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || 'root',
      database: process.env.DB_NAME || 'petalia_db'
    });

    console.log('Checking if api_logs table exists...');
    const [tables] = await connection.query("SHOW TABLES LIKE 'api_logs'");
    if (tables.length === 0) {
      console.log('Creating table api_logs manually for testing...');
      await connection.query(`
        CREATE TABLE IF NOT EXISTS api_logs (
          id INT AUTO_INCREMENT PRIMARY KEY,
          endpoint_consultado VARCHAR(500) NOT NULL,
          codigo_estado INT NOT NULL,
          tiempo_respuesta_ms INT NOT NULL,
          fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      console.log('api_logs table created successfully.');
    } else {
      console.log('api_logs table exists!');
    }

    console.log('Inserting a mock log entry...');
    await connection.execute(
      'INSERT INTO api_logs (endpoint_consultado, codigo_estado, tiempo_respuesta_ms) VALUES (?, ?, ?)',
      ['https://perenual.com/api/v2/species-list?key=***&q=monstera', 200, 142]
    );

    console.log('Querying api_logs...');
    const [rows] = await connection.execute('SELECT * FROM api_logs ORDER BY id DESC LIMIT 1');
    console.log('Latest log entry:', rows[0]);

    console.log('Testing admin password verification against database hashes...');
    const [admins] = await connection.execute("SELECT password_hash FROM usuarios WHERE email = 'admin@petalia.com'");
    if (admins.length > 0) {
      const match = await bcrypt.compare('AdminPassword123!', admins[0].password_hash);
      console.log('Verification of AdminPassword123! password:', match ? 'SUCCESS' : 'FAILED');
    } else {
      console.log('No admin user found with email admin@petalia.com to verify password.');
    }

    console.log('Verification test completed successfully!');
  } catch (error) {
    console.error('Test failed with error:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

runTest();
