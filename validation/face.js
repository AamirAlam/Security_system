const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCriminalFields(data, files) {
  let errors = {};

  files = !isEmpty(files) ? files : "";

  if (Validator.isEmpty(files)) {
    errors.face_data = "Please add criminal images";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
