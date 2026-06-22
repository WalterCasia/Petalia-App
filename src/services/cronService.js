// src/services/cronService.js

const cron = require("node-cron");
const db = require("../config/db");
const { addDays, getWateringStatus } = require("../utils/helpers");
const { createWateringNotification } = require("./notificationService");

async function checkWateringAlerts() {
  const [plants] = await db.execute(
    `
    SELECT
      pu.id_usuario,
      pu.id_planta_usuario,
      pu.nombre_personalizado,
      pu.fecha_ultimo_riego,
      cp.nombre_comun,
      COALESCE(pu.frecuencia_riego_dias, cp.frecuencia_riego_dias) AS frecuencia_riego_dias
    FROM plantas_usuario pu
    INNER JOIN catalogo_plantas cp
      ON pu.id_catalogo = cp.id_catalogo
    WHERE pu.estado = 'Activa'
    `
  );

  for (const plant of plants) {
    const baseDate = plant.fecha_ultimo_riego || new Date();
    const nextWatering = addDays(baseDate, plant.frecuencia_riego_dias);
    const status = getWateringStatus(nextWatering);

    if (status === "ALERT" || status === "LATE") {
      const plantName =
        plant.nombre_personalizado ||
        plant.nombre_comun ||
        "sin nombre";

      await createWateringNotification(plant.id_usuario, plantName);
    }
  }
}

function startCronService() {
  // Runs every hour.
  cron.schedule("0 * * * *", async () => {
    try {
      console.log("Checking watering alerts...");
      await checkWateringAlerts();
    } catch (error) {
      console.error("Error checking watering alerts:", error.message);
    }
  });
}

module.exports = {
  checkWateringAlerts,
  startCronService
};