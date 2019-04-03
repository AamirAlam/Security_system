const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const FS = require("fs");
const isEmpty = require("../../validation/is-empty");

//LOAD MODEL
const NumberPlate = require("../../models/NumberPlate");
const Camera = require("../../models/Camera");
const Alert = require("../../models/Alert");

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

// @route   GET request api/posts/test
// @desc    Test Performance of queries
// @access  Public
router.get("/test", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.json({ user: req.user.name });
});

// @route   POST request api/number_plate/add
// @desc    Add new Detected Number Plate
// @access  Public
router.post("/add", upload.single("plate_image"), (req, res) => {
  if (isEmpty(req.file)) {
    return res.status(404).json({ message: "Please Add a file" });
  }

  if (isEmpty(req.body.camera_id)) {
    return res.status(404).json({ message: "Please add camera id" });
  }

  const numberPlateFeilds = {};
  numberPlateFeilds.plate_image = req.file.filename;
  numberPlateFeilds.plate_number = req.body.plate_number;
  numberPlateFeilds.camera_id = req.body.camera_id;

  Camera.find({ camera_id: req.body.camera_id }).then(camera => {
    if (isEmpty(camera)) {
      return res.status(404).json({ message: "Invalid camera id" });
    }
    new NumberPlate(numberPlateFeilds)
      .save()
      .then(ref => {
        res.json(ref);
      })
      .catch(err => {
        res.status(404).json(err);
      });
  });
});

// @route   GET request api/numberplate/all/1
// @desc    GET Detected motions
// @access  Public
router.get("/all/:page_number", passport.authenticate("jwt", { session: false }), (req, res) => {
  NumberPlate.find()
    .sort({ date: -1 })
    .skip((req.params.page_number - 1) * 10)
    .limit(10)
    .then(plates => {
      if (isEmpty(plates)) {
        return res.status(404).json({ message: "No plates found" });
      }
      res.json(plates);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET request api/numberplate/number/:number
// @desc    GET Detected motions
// @access  Public
router.get("/by_number/:plate_number", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (isEmpty(req.params.plate_number)) {
    return res.status(404).json({ message: "Please provile plate number" });
  }
  console.log(req.params.plate_number);
  NumberPlate.find({ plate_number: req.params.plate_number })
    .then(plates => {
      res.json(plates);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
