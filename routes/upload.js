const express = require("express");
const router = express.Router();

const User = require("../models/User");
const Pic = require("../models/Scan");

const multer = require("multer")

const upload = multer({dest:__dirname+"/../public/images/scan"}) // basicAuth/routes../public/images/album

router.post("/",upload.single("photo"), (req,res)=>{
  //midleware to take care of store the image in the folder
  //get the location of that file and update my User
  debugger; //check req.file.filename for Path in Pic
  const name = req.body.name;
  const path = req.file.filename;
  const originalName = req.file.originalname;
  const id = req.session.user._id;
  debugger;
  Pic.create({
    name: name,
    path: path,
    originalName: originalName,
    author: id
  })
  .then(pic => {
    console.log(pic.id);
    debugger;//check pic._id for user update
    return User.findByIdAndUpdate(
        id,
        { $push: { picture: pic.id } }
      );
  })
  .then(result => {
    res.redirect("/profile");
  })
  .catch(err=>{
    next(err);
  });
});

module.exports = router;