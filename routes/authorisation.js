const express = require("express");
const router = express.Router();

//Our custom middleware function.
router.use("/", (req, res, next) => {
  if (req.session.user) {
    next();
  } else {
    res.redirect("/");
  }
});

module.exports = router;