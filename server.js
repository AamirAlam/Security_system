const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// import and configure routes to be used
const users = require("./routes/api/users");
const motion = require("./routes/api/motion");

const camera = require("./routes/api/camera");
const numberplate = require("./routes/api/numberplate");

const app = express();

// Body parser middleware
// change max upload limit
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: false,
    parameterLimit: 50000
  })
);

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport")(passport);

// Use Routes
app.use("/api/users", users);
app.use("/api/motion", motion);
app.use("/api/camera", camera);
app.use("/api/numberplate", numberplate);

const port = process.env.PORT || 27017;

app.listen(port, () => console.log(`Server running on port ${port}`));
