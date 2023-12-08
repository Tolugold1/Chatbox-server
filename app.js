require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require("express-session");
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('./routes/cors')
const helmet = require('helmet');
const {HTTPError} = require("./utils/errors");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var googleRouter = require('./routes/googleAuth');
var messageRouter = require("./routes/message");

var app = express();
app.options(cors.corsWithOption, (req, res, next) => { res.sendStatus(200)})

mongoose.connect(process.env.MONGO_DB, { useNewUrlParser: true })
.then((db) => {
  console.log('connected to the server successfully.');
})


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SECRET_KEY));
app.use(session({
  name: "session_id",
  saveUninitialized: false,
  resave: false,
  secret: process.env.SECRET_KEY,
}))
app.use(passport.initialize());
app.use(passport.session());

app.use(cors.cors);
app.use(cors.corsWithOption);
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use("/auth", googleRouter);
app.use("/msg", messageRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development

  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  if (err instanceof HTTPError) {
    return res.status(err.statusCode).json({
      title: err.name,
      message: err.message,
    });
  }

  console.log(err.stack);
  // HANDLE MONGOOSE DUPLICATE ERROR
  if (err.code == 11000) {
    return res.status(400).json({
      title: "Duplicate Field",
      message: `${Object.keys(err.keyValue)} already exists`,
    });
  }
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
