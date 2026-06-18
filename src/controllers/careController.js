// src/controllers/careController.js

const {
  createCareHistory,
  getCareHistoryByUser,
  verifyPlantBelongsToUser,
  updateLastWateringDate,
  updateLastFertilizingDate
} = require("../models/CareHistory");

const {
  createNextWateringDate,
  markTodayWateringAsCompleted,
  getWateringCalendarByUser,
  getPlantsWithWateringStatus
} = require("../services/calendarService");

const {
  createWateringNotification,
  getUnreadNotifications,
  markNotificationAsRead
} = require("../services/notificationService");

function getUserId(req) {
  return req.user?.id_usuario || req.user?.id || req.userId;
}

async function checkCare(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const { idPlantaUsuario } = req.params;
    const { tipo_cuidado = "Riego", observaciones = "" } = req.body;

    const validTypes = ["Riego", "Fertilizacion", "Poda", "Trasplante"];

    if (!validTypes.includes(tipo_cuidado)) {
      return res.status(400).json({
        error: "Tipo de cuidado inválido."
      });
    }

    const plant = await verifyPlantBelongsToUser(idPlantaUsuario, idUsuario);

    if (!plant) {
      return res.status(404).json({
        error: "La planta no existe o no pertenece al usuario."
      });
    }

    const idHistorial = await createCareHistory(
      idPlantaUsuario,
      tipo_cuidado,
      observaciones
    );

    let nextWateringDate = null;

    if (tipo_cuidado === "Riego") {
      await updateLastWateringDate(idPlantaUsuario);
      await markTodayWateringAsCompleted(idPlantaUsuario);

      nextWateringDate = await createNextWateringDate(
        idPlantaUsuario,
        plant.frecuencia_riego_dias
      );
    } else if (tipo_cuidado === "Fertilizacion") {
      await updateLastFertilizingDate(idPlantaUsuario);
    }

    return res.status(201).json({
      message: "Cuidado registrado correctamente.",
      id_historial: idHistorial,
      tipo_cuidado,
      proximo_riego: nextWateringDate
    });
  } catch (error) {
    next(error);
  }
}

async function regarPlant(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const { id } = req.params;
    const idPlantaUsuario = id;

    const plant = await verifyPlantBelongsToUser(idPlantaUsuario, idUsuario);
    if (!plant) {
      return res.status(404).json({
        error: "La planta no existe o no pertenece al usuario."
      });
    }

    const idHistorial = await createCareHistory(
      idPlantaUsuario,
      "Riego",
      "Riego manual registrado"
    );

    await updateLastWateringDate(idPlantaUsuario);
    await markTodayWateringAsCompleted(idPlantaUsuario);

    const nextWateringDate = await createNextWateringDate(
      idPlantaUsuario,
      plant.frecuencia_riego_dias
    );

    const todayStr = new Date().toISOString().split('T')[0];

    return res.status(200).json({
      message: "Riego registrado correctamente.",
      id_historial: idHistorial,
      fecha_ultimo_riego: todayStr,
      proximo_riego: nextWateringDate
    });
  } catch (error) {
    next(error);
  }
}

async function abonarPlant(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const { id } = req.params;
    const idPlantaUsuario = id;

    const plant = await verifyPlantBelongsToUser(idPlantaUsuario, idUsuario);
    if (!plant) {
      return res.status(404).json({
        error: "La planta no existe o no pertenece al usuario."
      });
    }

    const idHistorial = await createCareHistory(
      idPlantaUsuario,
      "Fertilizacion",
      "Abono manual registrado"
    );

    await updateLastFertilizingDate(idPlantaUsuario);

    const todayStr = new Date().toISOString().split('T')[0];

    return res.status(200).json({
      message: "Abono registrado correctamente.",
      id_historial: idHistorial,
      fecha_ultimo_abono: todayStr
    });
  } catch (error) {
    next(error);
  }
}

async function getHistory(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const history = await getCareHistoryByUser(idUsuario);

    return res.status(200).json(history);
  } catch (error) {
    next(error);
  }
}

async function getCalendar(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const calendar = await getWateringCalendarByUser(idUsuario);

    return res.status(200).json({
      total: calendar.length,
      calendario: calendar
    });
  } catch (error) {
    next(error);
  }
}

async function getWateringAlerts(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const plants = await getPlantsWithWateringStatus(idUsuario);

    const alerts = plants.filter(
      (plant) =>
        plant.estado_riego === "ALERT" ||
        plant.estado_riego === "LATE"
    );

    for (const plant of alerts) {
      const plantName =
        plant.nombre_personalizado ||
        plant.nombre_comun ||
        "sin nombre";

      await createWateringNotification(idUsuario, plantName);
    }

    return res.status(200).json({
      total: alerts.length,
      alertas: alerts
    });
  } catch (error) {
    next(error);
  }
}

async function getNotifications(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const notifications = await getUnreadNotifications(idUsuario);

    return res.status(200).json({
      total: notifications.length,
      notificaciones: notifications
    });
  } catch (error) {
    next(error);
  }
}

async function readNotification(req, res, next) {
  try {
    const idUsuario = getUserId(req);
    const { idNotificacion } = req.params;

    const updated = await markNotificationAsRead(idUsuario, idNotificacion);

    if (!updated) {
      return res.status(404).json({
        error: "Notificación no encontrada."
      });
    }

    return res.status(200).json({
      message: "Notificación marcada como leída."
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  checkCare,
  regarPlant,
  abonarPlant,
  getHistory,
  getCalendar,
  getWateringAlerts,
  getNotifications,
  readNotification
};