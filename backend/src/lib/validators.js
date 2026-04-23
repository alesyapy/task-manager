function isValidDate(value) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

function isValidOrder(value) {
  return Number.isInteger(value) && value >= 0;
}

module.exports = {
  isValidDate,
  isValidOrder,
};