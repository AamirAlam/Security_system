const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CriminalRecordSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  father_name: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  contact_number: {
    type: String
  },
  crime: {
    type: String,
    required: true
  },
  front_face: {
    type: String
  },
  left_face: {
    type: String
  },
  right_face: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = CriminalInfo = mongoose.model("criminal_record", CriminalRecordSchema);
