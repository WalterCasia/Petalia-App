// src/routes/careRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  checkCare,
  getHistory,
  getCalendar,
  getWateringAlerts,
  getNotifications,
  readNotification
} = require("../controllers/careController");

router.post("/:idPlantaUsuario/check", authMiddleware, checkCare);

router.get("/history", authMiddleware, getHistory);

router.get("/calendar", authMiddleware, getCalendar);

router.get("/alerts", authMiddleware, getWateringAlerts);

router.get("/notifications", authMiddleware, getNotifications);

router.patch("/notifications/:idNotificacion/read", authMiddleware, readNotification);

module.exports = router;