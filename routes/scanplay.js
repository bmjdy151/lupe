var express = require('express');
var router = express.Router();

//translate API
const projectId = "lupelupelupe";
const {Translate} = require('@google-cloud/translate');
const translate = new Translate({projectId});


//data models
const User = require("../models/User");
const Scan = require("../models/Scan");


router.get('/', function(req, res, next) {
  // const text = re;
  User.findById(req.session.user._id)
  .populate("scan") 
  .then(async user => {
    debugger;
    const target = user.language; 
    const text = user.scan[user.scan.length-1].labels[0].description;
    const [translation] = await translate.translate(text, target);
    console.log(`Text: ${text}`);
    console.log(`Translation: ${translation}`);  
    debugger;
    res.render("scanplay",{scan:user.scan[user.scan.length-1],translation:translation});
  })
  .catch(err => {
    console.error(err);
  });
});

router.get("/:id", (req, res) => {
  debugger;
  Scan.findById(req.params.id)
  .populate("user")
  .then(async scan => {
    debugger;
    const target = scan.user.language;
    const text = scan.labels[0].description;
    const [translation] = await translate.translate(text, target);
    debugger;
    res.render("scanplay",{scan:scan,translation:translation});
  })
  .catch(err => {
    console.error(err);
  });
});

router.get("/delete/:id", (req, res) => {
  const id = req.session.user._id;
  debugger;
  Scan.findByIdAndDelete(req.params.id)
  .then(scan => {
    debugger;
    return User.findByIdAndUpdate(
      id,
      { $pull: { scan: scan._id } },
      { new: true }
    )
  })
  .then(result => {
    debugger;
    res.redirect("/profile");
  })
  .catch(err => {
    console.error(err);
  });
});

module.exports = router;