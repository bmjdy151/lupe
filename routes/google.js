var express = require('express');
var router = express.Router();

const User = require("../models/User");

const multer = require("multer");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+ '/../public/images/scan')
  },
  filename: function (req, file, cb) {
    let extension = file.mimetype.substr( file.mimetype.indexOf("/") + 1 )
    debugger
    cb(null, file.fieldname + '-' + Date.now() + "." + extension)
  }
})

const upload = multer({storage})
router.post("/",upload.single("scan-img"),(req,res)=>{
  console.log("req.body:",req.file.path);
  debugger
  // var buffer = Buffer.alloc(15, req.body, 'base64');
  // Imports the Google Cloud client library
  const vision = require('@google-cloud/vision');
  // Creates a client
  const client = new vision.ImageAnnotatorClient();
  const request = {
    // image: {
    //   content: Object.keys(req.body)[0]
    // }
      image: {
      source: {imageUri: req.file.path}
    }
    // features: {
    //   type:"LABEL_DETECTION",
    //   maxResults:"5"
    // }
    // image: {
    //   source: {imageUri: 'https://images-na.ssl-images-amazon.com/images/I/51GfWevWFiL._SX425_.jpg'}
    // }
  };
  debugger;

  client
  .labelDetection(request)
  .then(response => {
    debugger
    const labels = response[0].labelAnnotations;
    console.log('Labels:');
    labels.forEach(label => console.log(label.description));
  })
  .catch(err => {
    console.error(err);
  });
});

module.exports = router;
