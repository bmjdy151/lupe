var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const authorisationRouter = require("./routes/authorisation");
const scanRouter = require("./routes/scan");
const googleRouter = require("./routes/google");

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

var app = express();

require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(connection => {
    console.log("successfully connected");
  })
  .catch(err => {
    console.log(err);
  });

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
  
//Session middleware. This will take care of storing the session in mongo,
//and
app.use(
  session({
    secret: "wow much secret, very secret", //encrypts cookie (so it hashes)
    cookie: { maxAge: 1 * 60 * 60 * 1000}, // options for cookie storage
    resave: false, //don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 1 * 60 * 60 * 1000// 1 day expiration of sesh
    })
  })
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/auth", authRouter);
app.use("/profile", authorisationRouter, profileRouter);
app.use("/scan", scanRouter);
app.use("/google", googleRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
