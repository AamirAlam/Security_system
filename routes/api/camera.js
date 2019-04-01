const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");
const FS = require("fs");
const isEmpty = require("../../validation/is-empty");

//LOAD MODEL
const Camera = require("../../models/Camera");

const crypto = require("crypto");

//Validator
const validateCameraInput = require("../../validation/camera");

// @route   POST request api/camera/add
// @desc    Add new camera
// @access  Private
router.post("/add", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { errors, isValid } = validateCameraInput(req.body);

  //Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const cameraFields = {};
  cameraFields.location = req.body.location;
  cameraFields.coordinate = req.body.coordinate;
  cameraFields.camera_id = req.body.camera_id;
  Camera.find({ camera_id: req.body.camera_id })
    .then(camera => {
      console.log(camera);
      if (!isEmpty(camera)) {
        return res.status(404).json({ message: "Camera id already exist" });
      }
      new Camera(cameraFields)
        .save()
        .then(ref => {
          res.json(ref);
        })
        .catch(err => {
          return res.status(404).json(err);
        });
    })
    .catch(err => {
      return res.status(404).json(err);
    });
});

// @route   GET request api/camera/all
// @desc    GET lsit of all camrea
// @access  Private
router.get("/all", passport.authenticate("jwt", { session: false }), (req, res) => {
  Camera.find()
    .sort({ date: -1 })
    .then(cameras => {
      if (isEmpty(cameras)) {
        return res.status(404).json({ message: "No camera found" });
      }
      res.json(cameras);
    })
    .catch(err => res.status(404).json(err));
});

// @route   GET request api/camera/all
// @desc    GET lsit of all camrea
// @access  Private
router.post("/update_status", passport.authenticate("jwt", { session: false }), (req, res) => {
  if (isEmpty(req.body.camera_id)) {
    return res.status(404).json({ message: "Invalid camera id" });
  }

  Camera.findOneAndUpdate({ camera_id: req.body.camera_id }, { $set: { is_live: true } })
    .then(camera => {
      if (isEmpty(camera)) {
        return res.status(404).json({ message: "No camera found" });
      }
      res.json(camera);
    })
    .catch(err => res.status(404).json(err));
});

module.exports = router;
