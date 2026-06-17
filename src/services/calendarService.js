// src/services/calendarService.js

const db = require("../config/db");
const { addDays, formatDate, getWateringStatus } = require("../utils/helpers");

async function createNextWateringDate(idPlantaUsuario, frecuenciaRiegoDias) {
  const today = new Date();
  const nextDate = addDays(today, frecuenciaRiegoDias);
  const formattedDate = formatDate(nextDate);

  await db.execute(
    `
    INSERT INTO calendario_riego
    (id_planta_usuario, fecha_programada, completado)
    VALUES (?, ?, FALSE)
    `,
    [idPlantaUsuario, formattedDate]
  );

  return formattedDate;
}

async function markTodayWateringAsCompleted(idPlantaUsuario) {
  await db.execute(
    `
    UPDATE calendario_riego
    SET completado = TRUE
    WHERE id_planta_usuario = ?
      AND fecha_programada <= CURDATE()
      AND completado = FALSE
    `,
    [idPlantaUsuario]
  );
}

async function getWateringCalendarByUser(idUsuario) {
  const [rows] = await db.execute(
    `
    SELECT 
      cr.id_calendario,
      cr.id_planta_usuario,
      pu.nombre_personalizado,
      cp.nombre_comun,
      cp.nombre_cientifico,
      cr.fecha_programada,
      cr.completado
    FROM calendario_riego cr
    INNER JOIN plantas_usuario pu
      ON cr.id_planta_usuario = pu.id_planta_usuario
    INNER JOIN catalogo_plantas cp
      ON pu.id_catalogo = cp.id_catalogo
    WHERE pu.id_usuario = ?
      AND pu.estado = 'Activa'
    ORDER BY cr.fecha_programada ASC
    `,
    [idUsuario]
  );

  return rows.map((item) => ({
    ...item,
    estado_riego: getWateringStatus(item.fecha_programada)
  }));
}

async function getPlantsWithWateringStatus(idUsuario) {
  const [rows] = await db.execute(
    `
    SELECT
      pu.id_planta_usuario,
      pu.nombre_personalizado,
      pu.fecha_ultimo_riego,
      cp.nombre_comun,
      cp.nombre_cientifico,
      cp.frecuencia_riego_dias,
      cp.imagen_url
    FROM plantas_usuario pu
    INNER JOIN catalogo_plantas cp
      ON pu.id_catalogo = cp.id_catalogo
    WHERE pu.id_usuario = ?
      AND pu.estado = 'Activa'
    ORDER BY pu.fecha_registro DESC
    `,
    [idUsuario]
  );

  return rows.map((plant) => {
    const baseDate = plant.fecha_ultimo_riego || new Date();
    const nextWatering = addDays(baseDate, plant.frecuencia_riego_dias);

    return {
      ...plant,
      proximo_riego: formatDate(nextWatering),
      estado_riego: getWateringStatus(nextWatering)
    };
  });
}

module.exports = {
  createNextWateringDate,
  markTodayWateringAsCompleted,
  getWateringCalendarByUser,
  getPlantsWithWateringStatus
};