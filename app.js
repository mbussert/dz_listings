var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var _ = require('underscore');
var db = require('./helper_data').db
const dotenv = require('dotenv')
var Filter = require('bad-words');
// var CensorifyIt = require('censorify-it')
var app = express();


var session = require('express-session')
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))
var passwordless = require('passwordless');
var NodeCacheStore = require('passwordless-nodecache');
var nodeoutlook = require('nodejs-nodemailer-outlook')
let EMAIL_TO = process.env.EMAIL_TO
let EMAIL_PASS = process.env.EMAIL_PASS
let EMAIL_FROM = process.env.EMAIL_FROM
function mail(mailMessage, recipient) {
  nodeoutlook.sendEmail({
    auth: {
      user: EMAIL_FROM,
      pass: EMAIL_PASS
    },
    from: EMAIL_FROM,
    to: recipient,
    subject: '@@LISTINGS@@',
    html: mailMessage,
    text: mailMessage,
    replyTo: EMAIL_FROM,
    onError: (e) => console.log(e),
    onSuccess: (i) => console.log(i)
  });
}
passwordless.init(new NodeCacheStore());
// Set up a delivery service
passwordless.addDelivery(
  function (tokenToSend, uidToSend, recipient, callback, req) {
    var host = 'localhost:3000/logged_in';
    var text = 'Hello!\nAccess your account here: http://' + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend)
    mail(text, recipient)
  });
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken());

global.passwordless = passwordless




var indexRouter = require('./routes/index');
var listingsRouter = require('./routes/listings');

dotenv.config()
console.log(`Your port is ${process.env.PORT}`) // 8626



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var customFilter = new Filter({ placeHolder: 'x' });

var trimmer = function (req, res, next) {
  req.body = _.object(_.map(req.body, function (value, key) {
    if (value && value.length)
      return [key, value.trim()];
    else
      return [key, value];
  }));
  next();
}

app.use(trimmer);
// get bigVar from disk
db.backup()

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

const dns = require('dns')
app.use(function (req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7)
  }

  if (process.env.NODE_ENV === 'dev' || ip.split('.')[0] === '127') { return next() }
  const reversedIp = ip.split('.').reverse().join('.')
  dns.resolve4([process.env.HONEYPOT_KEY, reversedIp, 'dnsbl.httpbl.org'].join('.'), function (err, addresses) {
    if (!addresses) { return next() }
    const _response = addresses.toString().split('.').map(Number)
    const test = (_response[0] === 127 && _response[3] > 0) // visitor_type[_response[3]]
    if (test) { res.send({ msg: 'we hate spam to begin with!' }) }
    return next()
  })
})

// Session wise: add current login user to all requests
// app.use(function(req, res, next){
//   res.locals.user = req.session.user;
//   next();
// });



module.exports = app;
