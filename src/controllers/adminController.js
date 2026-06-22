// Ruta: src/controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');

// List all users
const getUsers = async (req, res, next) => {
  try {
    const [rows] = await db.execute(
      'SELECT id_usuario, nombre, email, rol, fecha_registro FROM usuarios'
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Delete a user and all related data (cascade)
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Get user plants
    const [userPlants] = await conn.execute('SELECT id_planta_usuario FROM plantas_usuario WHERE id_usuario = ?', [id]);
    const plantIds = userPlants.map(up => up.id_planta_usuario);

    if (plantIds.length > 0) {
      const placeholders = plantIds.map(() => '?').join(',');
      await conn.execute(`DELETE FROM fotos_plantas WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute(`DELETE FROM historial_cuidados WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute(`DELETE FROM calendario_riego WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute(`DELETE FROM notas_planta WHERE id_planta_usuario IN (${placeholders})`, plantIds);
    }

    // Delete user plants
    await conn.execute('DELETE FROM plantas_usuario WHERE id_usuario = ?', [id]);

    // Delete user notifications, identifications, favorites
    await conn.execute('DELETE FROM notificaciones WHERE id_usuario = ?', [id]);
    await conn.execute('DELETE FROM identificaciones WHERE id_usuario = ?', [id]);
    await conn.execute('DELETE FROM favoritos WHERE id_usuario = ?', [id]);

    // Delete user
    const [result] = await conn.execute('DELETE FROM usuarios WHERE id_usuario = ?', [id]);

    if (result.affectedRows === 0) {
      const err = new Error('User not found');
      err.status = 404;
      throw err;
    }

    await conn.commit();
    res.json({ message: 'User and all related botanical configurations deleted successfully' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// List all catalog plants
const getCatalogPlants = async (req, res, next) => {
  try {
    const [rows] = await db.execute('SELECT * FROM catalogo_plantas');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Create a catalog plant
const createCatalogPlant = async (req, res, next) => {
  try {
    const {
      nombre_cientifico,
      nombre_comun,
      descripcion,
      frecuencia_riego_dias,
      luz_recomendada,
      temperatura_min,
      temperatura_max,
      imagen_url
    } = req.body;

    if (!nombre_cientifico || !nombre_comun) {
      const error = new Error('Scientific and common names are required');
      error.status = 400;
      return next(error);
    }

    const sql = `
      INSERT INTO catalogo_plantas 
      (nombre_cientifico, nombre_comun, descripcion, frecuencia_riego_dias, luz_recomendada, temperatura_min, temperatura_max, imagen_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      nombre_cientifico,
      nombre_comun,
      descripcion || null,
      frecuencia_riego_dias || 7,
      luz_recomendada || null,
      temperatura_min || null,
      temperatura_max || null,
      imagen_url || null
    ]);

    res.status(201).json({
      message: 'Catalog plant created successfully',
      plant: {
        id_catalogo: result.insertId,
        nombre_cientifico,
        nombre_comun,
        descripcion,
        frecuencia_riego_dias,
        luz_recomendada,
        temperatura_min,
        temperatura_max,
        imagen_url
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update a catalog plant
const updateCatalogPlant = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      nombre_cientifico,
      nombre_comun,
      descripcion,
      frecuencia_riego_dias,
      luz_recomendada,
      temperatura_min,
      temperatura_max,
      imagen_url
    } = req.body;

    const [existing] = await db.execute('SELECT * FROM catalogo_plantas WHERE id_catalogo = ?', [id]);
    if (existing.length === 0) {
      const error = new Error('Catalog plant not found');
      error.status = 404;
      return next(error);
    }

    const sql = `
      UPDATE catalogo_plantas
      SET nombre_cientifico = ?, nombre_comun = ?, descripcion = ?, frecuencia_riego_dias = ?, luz_recomendada = ?, temperatura_min = ?, temperatura_max = ?, imagen_url = ?
      WHERE id_catalogo = ?
    `;

    await db.execute(sql, [
      nombre_cientifico !== undefined ? nombre_cientifico : existing[0].nombre_cientifico,
      nombre_comun !== undefined ? nombre_comun : existing[0].nombre_comun,
      descripcion !== undefined ? descripcion : existing[0].descripcion,
      frecuencia_riego_dias !== undefined ? frecuencia_riego_dias : existing[0].frecuencia_riego_dias,
      luz_recomendada !== undefined ? luz_recomendada : existing[0].luz_recomendada,
      temperatura_min !== undefined ? temperatura_min : existing[0].temperatura_min,
      temperatura_max !== undefined ? temperatura_max : existing[0].temperatura_max,
      imagen_url !== undefined ? imagen_url : existing[0].imagen_url,
      id
    ]);

    res.json({ message: 'Catalog plant updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete a catalog plant (cascade)
const deleteCatalogPlant = async (req, res, next) => {
  const { id } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // Get user plants referencing this catalog plant
    const [userPlants] = await conn.execute('SELECT id_planta_usuario FROM plantas_usuario WHERE id_catalogo = ?', [id]);
    const plantIds = userPlants.map(up => up.id_planta_usuario);

    if (plantIds.length > 0) {
      const placeholders = plantIds.map(() => '?').join(',');
      await conn.execute(`DELETE FROM fotos_plantas WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute(`DELETE FROM historial_cuidados WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute(`DELETE FROM calendario_riego WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute(`DELETE FROM notas_planta WHERE id_planta_usuario IN (${placeholders})`, plantIds);
      await conn.execute('DELETE FROM plantas_usuario WHERE id_catalogo = ?', [id]);
    }

    // Delete favorites of this plant
    await conn.execute('DELETE FROM favoritos WHERE id_catalogo = ?', [id]);

    // Delete from catalog
    const [result] = await conn.execute('DELETE FROM catalogo_plantas WHERE id_catalogo = ?', [id]);

    if (result.affectedRows === 0) {
      const err = new Error('Catalog plant not found');
      err.status = 404;
      throw err;
    }

    await conn.commit();
    res.json({ message: 'Catalog plant and related user instances deleted successfully' });
  } catch (err) {
    await conn.rollback();
    next(err);
  } finally {
    conn.release();
  }
};

// Retrieve external API consumption logs with password verification
const getApiLogs = async (req, res, next) => {
  try {
    const password = req.headers['x-admin-password'] || req.query.password;
    if (!password) {
      const error = new Error('Admin password confirmation required');
      error.status = 400;
      return next(error);
    }

    // Get the admin user's hashed password from the database
    const [userRows] = await db.execute(
      'SELECT password_hash FROM usuarios WHERE id_usuario = ?',
      [req.user.id_usuario]
    );

    if (userRows.length === 0) {
      const error = new Error('User not found');
      error.status = 404;
      return next(error);
    }

    // Verify password match
    const isMatch = await bcrypt.compare(password, userRows[0].password_hash);
    if (!isMatch) {
      const error = new Error('Incorrect password');
      error.status = 401;
      return next(error);
    }

    // Fetch api_logs
    const [logs] = await db.execute(
      'SELECT id, endpoint_consultado, codigo_estado, tiempo_respuesta_ms, fecha_creacion FROM api_logs ORDER BY fecha_creacion DESC'
    );

    // Calculate today's request count
    const [countRows] = await db.execute(
      'SELECT COUNT(*) AS total_hoy FROM api_logs WHERE DATE(fecha_creacion) = CURDATE()'
    );
    const total_hoy = countRows[0].total_hoy;

    res.json({
      logs,
      total_hoy
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  deleteUser,
  getCatalogPlants,
  createCatalogPlant,
  updateCatalogPlant,
  deleteCatalogPlant,
  getApiLogs
};

