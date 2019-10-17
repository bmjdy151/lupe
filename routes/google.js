var express = require('express');
var router = express.Router();

//data models
const User = require("../models/User");
const Scan = require("../models/Scan");
//other modules
const multer = require("multer");
const fs = require('fs');

// function to encode file data to base64 encoded string
function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString('base64');
}

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+ '/../public/images/scan')
  },
  filename: function (req, file, cb) {
    let extension = file.mimetype.substr( file.mimetype.indexOf("/") + 1 )
    // debugger
    cb(null, file.fieldname + '-' + Date.now() + "." + extension)
  }
})

function pathToFile(filename) {
  return `./public/images/scan/${filename}`
}

const upload = multer({storage})

router.post("/",upload.single("scan-img"),(req,res)=>{
  let base64string = base64_encode(pathToFile(req.file.filename));
  //vision API
  const vision = require('@google-cloud/vision');
  // Creates a client
  const client = new vision.ImageAnnotatorClient();
  const request = {
    image: {
      content: base64string
    }
  };
  const id = req.session.user._id;
  debugger;
  client
  .labelDetection(request)
  .then(response => {
    const labels = response[0].labelAnnotations;
    debugger;
    const labelObjects = labels.map(label => {
      return { description: label.description, score: label.score.toFixed(2)}
    })
    debugger;
    Scan.create({
      name: req.file.filename,
      path: req.file.path,
      labels:labelObjects,
      user: id
    })
    .then(scan => {
      debugger;
      return User.findByIdAndUpdate(
        id,
        { $push: { scan: scan._id } },
        { new: true }
      );
    })
    .then(user =>{
      debugger;
      console.log(user);
      res.send(200);
    })
    // .then(response =>{
    //   debugger;
    //   res.redirect("/scanplay");
    // })   
    // labels.forEach(label => 
    //   console.log('name:',label.description+", "+'score:',label.score)
    //   );
  })
  .catch(err => {
    console.error(err);
  });
});

module.exports = router;
