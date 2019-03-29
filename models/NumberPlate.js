const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NumberPlateSchema = new Schema({
  plate_image: {
    type: String,
    required: true
  },
  plate_number: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    default: Date.now
  },
  camera_id: {
    type: Schema.Types.ObjectId,
    ref: "camera"
  }
});

module.exports = NumberPlate = mongoose.model("number_plate", NumberPlateSchema);
