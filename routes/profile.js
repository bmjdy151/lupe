const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", (req, res) => {
  // debugger;
  User.findById(req.session.user._id)
    .populate("scan")
    .then(user => {
      debugger;
      res.render("profile", { user: user});
    });
});

router.post("/lang", async(req, res) => {
  const language = req.body.language;
  debugger;
  User.findByIdAndUpdate(req.session.user._id)
    await User.findByIdAndUpdate(req.session.user._id, {
      $set: { language }
    });
  res.redirect("/profile");
});


module.exports = router;