// services/lib.js
//
function validateNumber(number) {
  if (isNaN(number)) {
    return 0;
  } else {
    return number;
  }
}

function hexToDecimalWithPrecision(value, decimals) {
  let decimalPoint =
    typeof decimals === "string"
      ? parseInt(decimals, 16).toString()
      : decimals.toString();
  return parseInt(value, 16) / Number("1E" + decimalPoint);
}

exports.validateNumber = validateNumber;
exports.hexToDecimalWithPrecision = hexToDecimalWithPrecision;
