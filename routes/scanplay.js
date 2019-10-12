var express = require('express');
var router = express.Router();

//data models
const User = require("../models/User");
const Scan = require("../models/Scan");


router.get('/', function(req, res, next) {
  User.findById(req.session.user._id)
  .populate("scan") 
  .then(user => {
    debugger;
  })
  .catch(err => {
    console.error(err);
  });
});

router.get("/:id", (req, res) => {
  debugger;
  Scan.findById(req.params.id)
  .then(scan => {
    debugger;
    res.render("scanplay",{scan:scan});
  })
  .catch(err => {
    console.error(err);
  });
});

module.exports = router;