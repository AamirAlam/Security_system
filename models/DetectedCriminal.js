const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DetectedCriminalSchema = new Schema({
  criminal_id: {
    type: Schema.Types.ObjectId,
    ref: "criminal_record"
  },
  camera_id: {
    type: String
  },
  time: {
    type: Date,
    default: Date.now
  }
});

module.exports = DetectedCriminalInfo = mongoose.model("detected_criminal", DetectedCriminalSchema);
