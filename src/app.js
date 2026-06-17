const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({
    message: "API Petalia funcionando correctamente"
  });
});

// Aquí después montaremos tus rutas reales
// const careRoutes = require("./routes/careRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

// app.use("/api/care", careRoutes);
// app.use("/api/dashboard", dashboardRoutes);

module.exports = app;