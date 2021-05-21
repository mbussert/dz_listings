const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const _ = require('underscore');
const db = require('./helper_data').db;
const dotenv = require('dotenv');
const Filter = require('bad-words');
const compression = require('compression');
// var CensorifyIt = require('censorify-it')
const i18next = require('i18next');
const Backend = require('i18next-node-fs-backend');
const i18nextMiddleware = require('i18next-express-middleware');

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
      backend: {
        loadPath: __dirname + '/data/locales/{{lng}}/{{ns}}.json',
      },
      fallbackLng: 'en',
      preload: ['en', 'ar', 'fr'],
    });


const app = express();

app.use(i18nextMiddleware.handle(i18next));

app.get('/greeting', (req, res) => {
  const response = req.t('greeting');
  res.status(200);
  res.send(response);
});


app.use(compression());

const session = require('express-session');
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: {secure: false},
}));
app.use(flash());
const passwordless = require('passwordless');
const NodeCacheStore = require('passwordless-nodecache');
const nodemailer = require('nodemailer');
const EMAIL_TO = process.env.EMAIL_TO;
const EMAIL_PASS = process.env.EMAIL_PASS;
const EMAIL_FROM = process.env.EMAIL_FROM;

const transportOptions = {
  host: 'smtp.office365.com', // Office 365 server
  port: 587, // secure SMTP
  secure: false,
  auth: {
    user: EMAIL_FROM,
    pass: EMAIL_PASS,
  },
  tls: {ciphers: 'SSLv3'},
};
const transporter = nodemailer.createTransport(transportOptions);
transporter.verify(function(error, success) {
  if (error) {
    // TODO: hand server completely
    console.log(error);
  } else {
    console.log('Server is ready to take our messages');
  }
});

/**
 * Send an email using Outlook options
 * From Admin to loggin users
 * @param {string} mailMessage HTML content
 * @param {string} recipient address of recipient
 */
function logginMail(mailMessage, recipient) {
  transporter.sendMail({
    from: EMAIL_FROM,
    to: recipient,
    subject: '@@LISTINGS@@',
    html: mailMessage,
    text: mailMessage,
    replyTo: EMAIL_FROM,
  }, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  });
}

passwordless.init(new NodeCacheStore());
// Set up a delivery service
passwordless.addDelivery(
    function(tokenToSend, uidToSend, recipient, callback, req) {
      const host = 'localhost:3000/logged_in';
      const text = 'Hello!\nAccess your account here: http://' + host + '?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend);
      logginMail(text, recipient);
    });
app.use(passwordless.sessionSupport());
app.use(passwordless.acceptToken());

global.passwordless = passwordless;


const indexRouter = require('./routes/index');
const listingsRouter = require('./routes/listings');

dotenv.config();
console.log(`Your port is ${process.env.PORT}`); // 8626


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const customFilter = new Filter({placeHolder: 'x'});

const trimmer = function(req, res, next) {
  req.body = _.object(_.map(req.body, function(value, key) {
    if (value && value.length) {
      return [key, value.trim()];
    } else {
      return [key, value];
    }
  }));
  next();
};

app.use(trimmer);

// get bigVar from disk
db.backup();
app.use('/', indexRouter);
app.use('/listings', listingsRouter);


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

const dns = require('dns');
app.use(function(req, res, next) {
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  if (ip.substr(0, 7) === '::ffff:') {
    ip = ip.substr(7);
  }

  if (process.env.NODE_ENV === 'dev' || ip.split('.')[0] === '127') {
    return next();
  }
  const reversedIp = ip.split('.').reverse().join('.');
  dns.resolve4([process.env.HONEYPOT_KEY, reversedIp, 'dnsbl.httpbl.org'].join('.'),
      function(err, addresses) {
        if (!addresses) {
          return next();
        }
        const _response = addresses.toString().split('.').map(Number);
        // visitor_type[_response[3]]
        const test = (_response[0] === 127 && _response[3] > 0);
        if (test) {
          res.send({msg: 'we hate spam to begin with!'});
        }
        return next();
      });
});

// Session wise: add current login user to all requests
// app.use(function(req, res, next){
//   res.locals.user = req.session.user;
//   next();
// });


module.exports = app;
