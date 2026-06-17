// src/models/CareHistory.js

const db = require("../config/db");

async function createCareHistory(idPlantaUsuario, tipoCuidado, observaciones) {
  const [result] = await db.execute(
    `
    INSERT INTO historial_cuidados 
    (id_planta_usuario, tipo_cuidado, observaciones)
    VALUES (?, ?, ?)
    `,
    [idPlantaUsuario, tipoCuidado, observaciones || null]
  );

  return result.insertId;
}

async function getCareHistoryByUser(idUsuario) {
  const [rows] = await db.execute(
    `
    SELECT 
      hc.id_historial,
      hc.id_planta_usuario,
      pu.nombre_personalizado,
      cp.nombre_comun,
      cp.nombre_cientifico,
      hc.tipo_cuidado,
      hc.fecha_realizada,
      hc.observaciones
    FROM historial_cuidados hc
    INNER JOIN plantas_usuario pu
      ON hc.id_planta_usuario = pu.id_planta_usuario
    INNER JOIN catalogo_plantas cp
      ON pu.id_catalogo = cp.id_catalogo
    WHERE pu.id_usuario = ?
    ORDER BY hc.fecha_realizada DESC
    `,
    [idUsuario]
  );

  return rows;
}

async function verifyPlantBelongsToUser(idPlantaUsuario, idUsuario) {
  const [rows] = await db.execute(
    `
    SELECT 
      pu.id_planta_usuario,
      pu.id_usuario,
      pu.id_catalogo,
      pu.nombre_personalizado,
      pu.fecha_ultimo_riego,
      cp.nombre_comun,
      cp.nombre_cientifico,
      cp.frecuencia_riego_dias
    FROM plantas_usuario pu
    INNER JOIN catalogo_plantas cp
      ON pu.id_catalogo = cp.id_catalogo
    WHERE pu.id_planta_usuario = ?
      AND pu.id_usuario = ?
      AND pu.estado = 'Activa'
    LIMIT 1
    `,
    [idPlantaUsuario, idUsuario]
  );

  return rows[0] || null;
}

async function updateLastWateringDate(idPlantaUsuario) {
  await db.execute(
    `
    UPDATE plantas_usuario
    SET fecha_ultimo_riego = CURDATE()
    WHERE id_planta_usuario = ?
    `,
    [idPlantaUsuario]
  );
}

module.exports = {
  createCareHistory,
  getCareHistoryByUser,
  verifyPlantBelongsToUser,
  updateLastWateringDate
};