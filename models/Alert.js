const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AlertSchema = new Schema({
  alert: {
    type: String,
    required: true
  },
  from: {
    camera_id: {
      type: String
    },
    system: {
      type: String,
      required: true
    }
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = DetectedCriminalInfo = mongoose.model("alert", AlertSchema);
