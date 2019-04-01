const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCameraInput(data) {
  let errors = {};

  data.location = !isEmpty(data.location) ? data.location : "";
  data.coordinate = !isEmpty(data.coordinate) ? data.coordinate : "";
  data.camera_id = !isEmpty(data.camera_id) ? data.camera_id : "";

  if (Validator.isEmpty(data.location)) {
    errors.location = "Camera location field is required";
  }

  if (Validator.isEmpty(data.coordinate)) {
    errors.coordinate = "Camera coordinate field is required";
  }

  if (Validator.isEmpty(data.camera_id)) {
    errors.camera_id = "Camera id field is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
