// Ruta: src/utils/apiLogger.js
const db = require('../config/db');

/**
 * Logs an external API call to the api_logs database table.
 * Masks the API key value to keep credentials secure.
 * 
 * @param {string} endpoint - The requested endpoint URL.
 * @param {number} status - The HTTP status code returned.
 * @param {number} responseTimeMs - Response time in milliseconds.
 */
async function logApiCall(endpoint, status, responseTimeMs) {
  try {
    let maskedEndpoint = endpoint;
    try {
      const urlObj = new URL(endpoint);
      if (urlObj.searchParams.has('key')) {
        urlObj.searchParams.set('key', '***');
      }
      maskedEndpoint = urlObj.toString();
    } catch (e) {
      // Fallback regex masking if URL parsing fails
      maskedEndpoint = endpoint.replace(/key=[^&]+/g, 'key=***');
    }

    const sql = `
      INSERT INTO api_logs (endpoint_consultado, codigo_estado, tiempo_respuesta_ms)
      VALUES (?, ?, ?)
    `;
    await db.execute(sql, [maskedEndpoint, status, responseTimeMs]);
  } catch (error) {
    console.error('[ApiLogger] Error writing log entry to database:', error.message);
  }
}

module.exports = { logApiCall };
