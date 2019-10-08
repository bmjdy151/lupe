const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  // debugger;
  User.findById(req.session.user._id)
    .then(user => {
      // debugger;
      res.render("profile", { user: user });
    });
});



module.exports = router;