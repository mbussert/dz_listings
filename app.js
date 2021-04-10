var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var _ = require('underscore');
var db = require('./helper').db
const dotenv = require('dotenv')

var indexRouter = require('./routes/index');
var listingsRouter = require('./routes/listings');

dotenv.config()
console.log(`Your port is ${process.env.PORT}`) // 8626

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var trimmer = function(req, res, next){
  req.body = _.object(_.map(req.body, function (value, key) {
    return [key, value.trim()];
  }));
  next();
}

app.use(trimmer);
// get bigVar from disk
db.backup()
db.persist()

app.use('/', indexRouter);
app.use('/listings', listingsRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
