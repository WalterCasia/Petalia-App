// src/controllers/dashboardController.js

const { getCareHistoryByUser } = require("../models/CareHistory");
const {
  getWateringCalendarByUser,
  getPlantsWithWateringStatus
} = require("../services/calendarService");
const { getUnreadNotifications } = require("../services/notificationService");

function getUserId(req) {
  return req.user?.id_usuario || req.user?.id || req.userId;
}

async function getDashboard(req, res, next) {
  try {
    const idUsuario = getUserId(req);

    const plants = await getPlantsWithWateringStatus(idUsuario);
    const history = await getCareHistoryByUser(idUsuario);
    const notifications = await getUnreadNotifications(idUsuario);
    const calendar = await getWateringCalendarByUser(idUsuario);

    const plantsNeedWatering = plants.filter(
      (plant) =>
        plant.estado_riego === "ALERT" ||
        plant.estado_riego === "LATE"
    );

    return res.status(200).json({
      resumen: {
        total_plantas_activas: plants.length,
        plantas_con_riego_pendiente: plantsNeedWatering.length,
        notificaciones_pendientes: notifications.length,
        registros_historial: history.length
      },
      plantas: plants,
      alertas_riego: plantsNeedWatering,
      notificaciones: notifications.slice(0, 5),
      historial_reciente: history.slice(0, 5),
      calendario_proximo: calendar.slice(0, 7)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getDashboard
};