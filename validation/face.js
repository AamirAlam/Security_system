const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCriminalFields(files) {
  let errors = {};

  files = !isEmpty(files) ? files : [];
  console.log(files.length);
  if (files.length < 3) {
    errors.face_data = "Please add all sides criminal images";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
