const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const FS = require("fs");
const isEmpty = require("../../validation/is-empty");

//LOAD MODEL
const CriminalRecord = require("../..//models/CriminalRecord");
const DetectedCriminal = require("../../models/DetectedCriminal");
const Camera = require("../../models/Camera");
const Alert = require("../../models/Alert");

const validateCriminalFields = require("../../validation/face");

//Upload images

const multer = require("multer");
const crypto = require("crypto");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    let customfilename = crypto.randomBytes(18).toString("hex"),
      fileExtention = file.originalname.split(".").pop();
    cb(null, customfilename + "-" + Date.now() + "." + fileExtention);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 60
  }
});

// @route   POST request api/face/add
// @desc    Add new Criminal record
// @access  Public
router.post("/add", passport.authenticate("jwt", { session: false }), upload.any("face_data"), (req, res) => {
  const { errors, isValid } = validateCriminalFields(req.files);
  console.log(req.files);
  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const criminalFields = {};
  if (req.files) {
    if (req.files[0]) {
      criminalFields.front_face = req.files[0].filename;
    }
    if (req.files[1]) {
      criminalFields.left_face = req.files[1].filename;
    }
    if (req.files[2]) {
      criminalFields.right_face = req.files[2].filename;
    }
  }

  criminalFields.name = req.body.name;
  criminalFields.father_name = req.body.father_name;
  criminalFields.address = req.body.address;
  criminalFields.contact_number = req.body.contact_number;
  criminalFields.crime = req.body.crime;

  new CriminalRecord(criminalFields)
    .save()
    .then(ref => {
      res.json(ref);
    })
    .catch(err => {
      res.status(404).json(err);
    });
});

// @route   POST request api/face/add_detection
// @desc    POST add criminal detection from available record
// @access  Private
router.post("/add_detection", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (isEmpty(req.body.criminal_id)) {
    return res.status(404).json({ message: "please add valid criminal id" });
  }
  if (isEmpty(req.body.camera_id)) {
    return res.status(404).json({ message: "please add camera id" });
  }
  new DetectedCriminal(req.body)
    .save()
    .then(ref => {
      return res.json({ success: true });
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET request api/face/all/1
// @desc    GET Criminal records
// @access  Private
router.get("/all/:page_number", passport.authenticate("jwt", { session: false }), (req, res) => {
  CriminalRecord.find()
    .sort({ date: -1 })
    .skip((req.params.page_number - 1) * 10)
    .limit(10)
    .then(records => {
      if (isEmpty(records)) {
        return res.status(404).json({ message: "No record found" });
      }
      res.json(records);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET request api/numberplate/number/:number
// @desc    GET Detected motions
// @access  Public
router.get("/by_name/:name", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (isEmpty(req.params.name)) {
    return res.status(404).json({ message: "Please provile valid name" });
  }

  CriminalRecord.find({ name: req.params.name })
    .then(records => {
      res.json(records);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET request api/face/detected_criminals/:page_number
// @desc    GET Detected Criminals
// @access  Public
router.get("/detected_criminals/:page_number", passport.authenticate("jwt", { session: false }), (req, res) => {
  DetectedCriminal.find({})
    .sort({ date: -1 })
    .skip((req.params.page_number - 1) * 10)
    .limit(10)
    .then(record => {
      res.json(record);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
