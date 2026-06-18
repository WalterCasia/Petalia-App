// Ruta: server.js
const app = require('./src/app');
const { startCronService } = require('./src/services/cronService');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Start background cron jobs
startCronService();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});