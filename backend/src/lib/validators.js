function isValidDate(value) {
  if (!value) return false;
  return !Number.isNaN(new Date(value).getTime());
}

module.exports = {
  isValidDate,
};