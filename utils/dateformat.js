/*jslint node: true */
function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

module.exports.dateToString = function(date) {
  return date.getUTCFullYear() +
    '-' + pad(date.getUTCMonth() + 1) +
    '-' + pad(date.getUTCDate()) +
    ' ' + pad(date.getUTCHours()) +
    ':' + pad(date.getUTCMinutes()) +
    ':' + pad(date.getUTCSeconds());
};
