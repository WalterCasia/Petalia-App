// Ruta: src/utils/helpers.js

/**
 * Formats a database date to a standard string format.
 * @param {Date|string} date 
 * @returns {string}
 */
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toISOString().split('T')[0];
};

/**
 * Validates whether an email format is correct.
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Adds days to a date.
 * @param {Date|string} date 
 * @param {number} days 
 * @returns {Date}
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + parseInt(days, 10));
  return result;
};

/**
 * Calculates the watering status of a scheduled date.
 * @param {Date|string} nextWateringDate 
 * @returns {string} 'LATE' | 'ALERT' | 'OK'
 */
const getWateringStatus = (nextWateringDate) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextWater = new Date(nextWateringDate);
  nextWater.setHours(0, 0, 0, 0);

  const diffTime = nextWater.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'LATE';
  if (diffDays === 0) return 'ALERT';
  return 'OK';
};

module.exports = {
  formatDate,
  isValidEmail,
  addDays,
  getWateringStatus
};
