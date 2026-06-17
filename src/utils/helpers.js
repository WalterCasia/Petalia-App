
function formatDate(date) {
  if (!date) return null;
  return new Date(date).toISOString().split("T")[0];
}

function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + Number(days));
  return result;
}

function addHours(date, hours) {
  const result = new Date(date);
  result.setHours(result.getHours() + Number(hours));
  return result;
}

function getWateringStatus(nextWateringDate) {
  const now = new Date();

  // The DB stores DATE, so we treat the scheduled date as 00:00.
  const scheduled = new Date(nextWateringDate);
  scheduled.setHours(0, 0, 0, 0);

  const alertLimit = addHours(scheduled, 4);

  if (now < scheduled) {
    return "OK";
  }

  if (now >= scheduled && now <= alertLimit) {
    return "ALERT";
  }

  return "LATE";
}

module.exports = {
  formatDate,
  addDays,
  addHours,
  getWateringStatus
};