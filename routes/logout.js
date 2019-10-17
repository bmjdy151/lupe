var express = require('express');
var router = express.Router();

//logout
router.get('/', function(req, res, next) {
  debugger;
  if (req.session) {
    debugger;
    req.session.destroy(function(err) {
      if(err) {
        return next(err);
      } else {
        debugger;
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;
