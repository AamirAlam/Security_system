const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CameraSchema = new Schema({
  location: {
    type: String,
    required: true
  },
  coordinate: {
    type: String,
    required: true
  },
  is_live: {
    type: Boolean,
    default: false
  },
  camera_id: {
    type: String,
    required: true
  }
});

module.exports = DetectedCriminalInfo = mongoose.model("camera", CameraSchema);
