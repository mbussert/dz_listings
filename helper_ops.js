const ops = {};
const give = {};
const dotenv = require('dotenv');
dotenv.config();
const Multer = require('multer');
const path = require('path');


give.upload = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // no larger than 3mb.
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const sanitizeHtml = require('sanitize-html');
ops.sanitize = function sanitize(str) {
  const search1 = 'h1';
  const replacer1 = new RegExp(search1, 'g');
  const search2 = 'h2';
  const replacer2 = new RegExp(search2, 'g');
  str = str.replace(replacer1, 'h3').replace(replacer2, 'h4');
  return sanitizeHtml(str, {
    allowedTags: ['a', 'b', 'i', 'u', 'strike', 'ul', 'li', 'ol', 'pre', 'h3', 'h4', 'blockquote', 'hr', 'span', 'code'],
    allowedAttributes: {
      'span': ['style'],
      'a': ['href', 'name', 'target'],
    },
    allowedStyles: {
      '*': {
        // Match HEX and RGB
        'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
        'text-align': [/^left$/, /^right$/, /^center$/],
        // Match any number with px, em, or %
        'font-size': [/^\d+(?:px|em|%)$/],
      },
      'span': {
        'font-size': [/^\d+rem$/],
        'background-color': [/^pink$/],
      },
    },
  });
};


// Author: Anthony Goldman
// https://github.com/jaideepchilukuri/jaideepch/blob/2bd3d43adbbf951d07420d9dac944a2f5eec76a8/tools/maintainance/EJS/emptyconfigs/19.11.0/src/survey/surveyutils.js
// Based on Richard's Ramblings Regex patterns.
ops.cleanSensitive = function cleanSensitive(blob, maxlen) {
  // If max length is 0..
  if (maxlen === 0) {
    return '';
  }
  // If max length is smaller than any sensitive pattern (ssn is 9)
  if (maxlen < 9) {
    return blob;
  }

  if (blob.length > 9) {
    // regexp whitelist
    // List of things that should not be censored, like phone numbers
    const rew = {
      phone: /\b(?:(?:\(\d{3}\)?)|(?:\d{3}))[ -./\\]?\d{3}[ -./\\]?\d{4}\b/g,
    };
      // regexp blacklist
      // List of things to censor
      // helpful: http://www.richardsramblings.com/regex/credit-card-numbers/
      // helpful: https://codepen.io/gpeu/pen/eEdvmO
    const reb = {
      electron: /\b(4026|417500|4405|4508|4844|4913|4917)[ -./\\]?\d{4}[ -./\\]?\d{4}\d{3,4}\b/g,
      maestro: /\b(?:5[0678]\d\d|6304|6390|67\d\d)[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?(?:\d{4})?[ -./\\]?(?:\d{1,3})?\b/g,
      dankort: /\b(5019)[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
      instaPayment: /\b(637|638|639)[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{1}\b/g,
      visa: /\b4\d{3}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{1,4}\b/g,
      mastercard: /\b5[1-5]\d{2}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
      amex: /\b3[47]\d{2}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{3}\b/g,
      diners: /\b3(?:0[0-5]|[68]\d)\d{1}[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{2}\b/g,
      discover: /\b6(?:011|5\d{2}|22[19]|4[56789]\d{1})[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
      jcb: /\b(?:2131|1800|35\d[28-89])[ -./\\]?\d{4}[ -./\\]?\d{4}[ -./\\]?\d{4}\b/g,
      ssn: /\b\d{3}[ -./\\]?\d{2}[ -./\\]?\d{4}\b/g,
    };

    // Look for text that should not be censored following the regexp whitelist,
    // and remember where it is to be able to restore it later.
    const whitelisted = [];
    for (const regexw in rew) {
      blob = blob.replace(
          rew[regexw],
          function(match, index) {
            this.push({i: index, m: match});
            return '';
          }.bind(whitelisted),
      );
    }

    // utils to replace a matched string with Xs
    const maskStr = (match) => new Array(match.length + 1).join('X');

    // Censor sensitive data following the above regexp blacklist
    for (const regexb in reb) {
      // If there are, mask them
      blob = blob.replace(reb[regexb], maskStr);
    }

    // Restore whitelisted strings
    whitelisted.forEach((w) => {
      blob = blob.slice(0, w.i) + w.m + blob.slice(w.i);
    });
  }

  if (maxlen && blob.length >= this.maxlen) {
    blob = blob.substr(0, this.maxlen - 1);
  }

  return blob;
};


function formatMessage(msgContent) {
  return `<h1> Listings </h1> <br> <h2> A user sent you a message ! </h2> <p> ${msgContent} </p> <br><hr> <code> You can repond directly to this email. </code>`;
}

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
 * From Admin to admins for post validation
 * @param {string} message HTML content
 */
ops.approveMail = function approveMail(message) {
  transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: '@@LISTINGS@@',
    html: message,
    text: message,
    replyTo: EMAIL_FROM,
  }, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  });
};


/**
 * Send an email using Outlook options
 * MIMMail: Man In The Middle where Man is the Admin
 * on behalf of SENDER and RECIEVER,
 * @param {string} message HTML content
 */
ops.MIMMail = function MIMMail({message, EMAIL_SENDER, EMAIL_RECIEVER, subjectId}) {
  transporter.sendMail({
    from: EMAIL_FROM,
    to: EMAIL_RECIEVER,
    cc: [EMAIL_SENDER],
    inReplyTo: subjectId,
    subject: '@@LISTINGS@@',
    html: formatMessage(message),
    text: formatMessage(message),
    replyTo: EMAIL_SENDER,
  }, (err, info) => {
    console.log(info.envelope);
    console.log(info.messageId);
  });
};

const dz = require('./data/dz').dz;
// transform geojson coordinates into an array of L.LatLng
const coordinates = dz.features[0].geometry.coordinates[0];
// defaults to dz
ops.isPointInsidePolygon = function isPointInsidePolygon(point, vs = coordinates) {
  const x = point.lat; const y = point.lng;

  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][1]; const yi = vs[i][0];
    const xj = vs[j][1]; const yj = vs[j][0];

    const intersect = ((yi > y) != (yj > y)) &&
         (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};

const fs = require('fs');
const {compatto, DecompressError} = require('compatto');
const text = fs.readFileSync('./data/arabic.txt').toString('utf-8');
const arabic = text.split('\n').slice(0, 245);
const english = require('./node_modules/compatto/cjs/dictionary.cjs').dictionary;
const {
  compress: compress_en,
  decompress: decompress_en
} = compatto({
  dictionary: english,
});
const {
  compress: compress_ar,
  decompress: decompress_ar
} = compatto({
  dictionary: arabic,
});

ops.compress_en = compress_en;
ops.decompress_en = decompress_en;
ops.compress_ar = compress_ar;
ops.decompress_ar = decompress_ar;

module.exports.give = give;
module.exports.ops = ops;
