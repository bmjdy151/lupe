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
  var base64string = base64_encode(pathToFile(req.file.filename));
  // Imports the Google Cloud client library
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
    debugger;
    const labels = response[0].labelAnnotations;
    console.log('Labels:');
    const labelObjects = labels.map(label => {
      return { description: label.description, score: label.score }
    })
    labels.forEach(label => 

      console.log('name:',label.description+", "+'score:',label.score)
      );
  //   Scan.create({
  //     name: labels[0].description,
  //     // labels:{
  //     //   description:
  //     //   score:Decimal128
  //     // },
  //     user: id
  //   })
  //   .then(scan => {
  //     debugger;
  //     return User.findByIdAndUpdate(
  //       id,
  //       { $push: { scan: scan._id } },
  //       { new: true }
  //     );
  //   })
  })
  .catch(err => {
    console.error(err);
  });
});

module.exports = router;
