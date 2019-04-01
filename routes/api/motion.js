const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const FS = require("fs");
const isEmpty = require("../../validation/is-empty");

//LOAD MODEL
const DetectedMotion = require("../../models/DetectedMotion");
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

// @route   POST request api/detected_motion/add
// @desc    Add new Detected Motion
// @access  Public
router.post("/add", upload.single("motion_clip"), (req, res) => {
  if (isEmpty(req.file)) {
    return res.status(404).json({ message: "Please Add a file" });
  }

  console.log(req.body);
  const motionFields = {};

  motionFields.motion_clip = req.file.filename;

  motionFields.camera_id = req.body.camera_id;

  Camera.find({ camera_id: req.body.camera_id })
    .then(camera => {
      if (isEmpty(camera)) {
        return res.status(404).json({ message: "Unauthorized camera" });
      }

      new DetectedMotion(motionFields)
        .save()
        .then(ref => {
          res.json({ success: true });
        })
        .catch(err => res.status(404).json({ success: false }));
    })
    .catch(err => res.status(404).json({ message: "Invalid camera id" }));
  // console.log(req.body);
});

// @route   GET request api/detected_motion/all
// @desc    GET Detected motions
// @access  Public
router.get("/all/:page_number", passport.authenticate("jwt", { session: false }), (req, res) => {
  DetectedMotion.find()
    .sort({ date: -1 })
    .skip((req.params.page_number - 1) * 10)
    .limit(10)
    .then(motions => {
      if (isEmpty(motions)) {
        return res.status(404).json({ message: "No motios are detected yet" });
      }
      res.json(motions);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
