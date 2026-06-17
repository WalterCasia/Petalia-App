// src/services/notificationService.js

const db = require("../config/db");

async function createWateringNotification(idUsuario, plantName) {
  const title = "Riego pendiente";
  const message = `Hoy debes regar tu planta ${plantName}.`;

  const [existing] = await db.execute(
    `
    SELECT id_notificacion
    FROM notificaciones
    WHERE id_usuario = ?
      AND titulo = ?
      AND mensaje = ?
      AND DATE(fecha_envio) = CURDATE()
      AND leida = FALSE
    LIMIT 1
    `,
    [idUsuario, title, message]
  );

  if (existing.length > 0) {
    return existing[0].id_notificacion;
  }

  const [result] = await db.execute(
    `
    INSERT INTO notificaciones
    (id_usuario, titulo, mensaje, fecha_envio, leida)
    VALUES (?, ?, ?, NOW(), FALSE)
    `,
    [idUsuario, title, message]
  );

  return result.insertId;
}

async function getUnreadNotifications(idUsuario) {
  const [rows] = await db.execute(
    `
    SELECT 
      id_notificacion,
      titulo,
      mensaje,
      fecha_envio,
      leida
    FROM notificaciones
    WHERE id_usuario = ?
      AND leida = FALSE
    ORDER BY fecha_envio DESC
    `,
    [idUsuario]
  );

  return rows;
}

async function markNotificationAsRead(idUsuario, idNotificacion) {
  const [result] = await db.execute(
    `
    UPDATE notificaciones
    SET leida = TRUE
    WHERE id_notificacion = ?
      AND id_usuario = ?
    `,
    [idNotificacion, idUsuario]
  );

  return result.affectedRows > 0;
}

module.exports = {
  createWateringNotification,
  getUnreadNotifications,
  markNotificationAsRead
};