var ops = {}
var give = {}

var multer = require('multer')
var path = require('path')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(__dirname, './uploads'))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

give.upload = multer({
  storage: storage,
  onFileUploadStart: function (file) {
    console.log(file.originalname + ' is starting ...')
  },
})

const sanitizeHtml = require('sanitize-html');
ops.sanitize = function sanitize(str) {
    const search1 = 'h1'
    const replacer1 = new RegExp(search1, 'g')
    const search2 = 'h2'
    const replacer2 = new RegExp(search2, 'g')
    str = str.replace(replacer1, 'h3').replace(replacer2, 'h4')
    return sanitizeHtml(str, {
        allowedTags: ['a', 'b', 'i', 'u', 'strike', 'ul', 'li', 'ol', 'pre', 'h3', 'h4', 'blockquote', 'hr', 'span', 'code'],
        allowedAttributes: {
            'span': ["style"],
            'a': ['href', 'name', 'target']
        },
        allowedStyles: {
            '*': {
                // Match HEX and RGB
                'color': [/^#(0x)?[0-9a-f]+$/i, /^rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)$/],
                'text-align': [/^left$/, /^right$/, /^center$/],
                // Match any number with px, em, or %
                'font-size': [/^\d+(?:px|em|%)$/]
            },
            'span': {
                'font-size': [/^\d+rem$/],
                'background-color': [/^pink$/]
            }
        }
    });
}


// Author: Anthony Goldman https://github.com/jaideepchilukuri/jaideepch/blob/2bd3d43adbbf951d07420d9dac944a2f5eec76a8/tools/maintainance/EJS/emptyconfigs/19.11.0/src/survey/surveyutils.js
// Based on Richard's Ramblings Regex patterns.
ops.cleanSensitive = function cleanSensitive(blob, maxlen) {
    // If max length is 0..
    if (maxlen === 0) {
        return "";
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
                function (match, index) {
                    this.push({ i: index, m: match });
                    return "";
                }.bind(whitelisted)
            );
        }

        // utils to replace a matched string with Xs
        const maskStr = match => new Array(match.length + 1).join("X");

        // Censor sensitive data following the above regexp blacklist
        for (const regexb in reb) {
            // If there are, mask them
            blob = blob.replace(reb[regexb], maskStr);
        }

        // Restore whitelisted strings
        whitelisted.forEach(w => {
            blob = blob.slice(0, w.i) + w.m + blob.slice(w.i);
        });
    }

    if (maxlen && blob.length >= this.maxlen) {
        blob = blob.substr(0, this.maxlen - 1);
    }

    return blob;
}

module.exports.give = give;
module.exports.ops = ops;
