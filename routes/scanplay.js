var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  debugger;
  res.render("scanplay",{ scan:labels});
});

module.exports = router;