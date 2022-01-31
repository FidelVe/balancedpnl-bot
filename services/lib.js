// services/lib.js
//
function validateNumber(number) {
  if (isNaN(number)) {
    return 0;
  } else {
    return number;
  }
}

exports.validateNumber = validateNumber;
