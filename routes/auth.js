const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 1; 


router.post("/register", (req, res) => {
  // debugger;
  const { firstName, lastName, email, password, language, gender } = req.body;
  // debugger;
  bcrypt
    .hash(password, saltRounds)
    .then(hashedPassword => {
      return User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        language,
        gender
      });
    })
    .then(user => {
      req.session.user = user;
      debugger;
      res.redirect("/profile");
      // res.redirect("/profile", { user: user });
    })
    .catch(err => {
      res.send("error");
    });
});

router.post("/login", (req, res, next) => {
  // debugger;
  let currentUser;
  const { name, password } = req.body;

  User.findOne({ name })
    .then(user => {
      debugger;
      if (!user) {
        res.redirect("/");
        return false;
      } else {
        //first arg, is client
        //second arg is from db
        currentUser = user;
        debugger;
        return bcrypt.compare(password, user.password); //true or false
      }
    })
    .then(passwordCorrect => {
      if (passwordCorrect) {
        //storing session in our database
        //and set cookie in client.
        const session = req.session;
        session.user = currentUser;
        debugger;
        //cookie with sesh id is set
        res.redirect("/profile");
        return;
      } else {
        res.send("Credentials don't match.");
        return;
      }
    })
    .catch(err => {
      debugger;
      console.log("err", err);
    });
});

module.exports = router;
