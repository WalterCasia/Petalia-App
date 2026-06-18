// src/routes/careRoutes.js

const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  checkCare,
  regarPlant,
  abonarPlant,
  getHistory,
  getCalendar,
  getWateringAlerts,
  getNotifications,
  readNotification
} = require("../controllers/careController");

// Protect all care routes
router.use(authMiddleware);

// Endpoints required by the frontend
router.get("/historial", getHistory);
router.post("/plantas/:id/regar", regarPlant);
router.post("/plantas/:id/abonar", abonarPlant);

// Endpoints for scheduled jobs or extra features
router.post("/:idPlantaUsuario/check", checkCare);
router.get("/history", getHistory); // compatibility alias
router.get("/calendar", getCalendar);
router.get("/alerts", getWateringAlerts);
router.get("/notifications", getNotifications);
router.patch("/notifications/:idNotificacion/read", readNotification);

module.exports = router;