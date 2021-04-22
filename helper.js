var _ = require('underscore');
const fs = require('fs')
var smaz = require("smaz")
var db = {}
var give = {}

// title: 'title1' => is a title
// a: 0 => approved by admin
// d: 0 => deactivated by user
// desc: 'oipfjezojifze' => extended description
// pass: 'qub7s1ya' => password to deactivate
// tags: ["tag1", "tag2"] => tags

// Clean and persist every 3 hours
var CronJob = require('cron').CronJob;
var job = new CronJob('0 0 */3 * * *', function () {
    console.log("===== cycle ===== ")
    db.cycle()
}, null, true, 'America/Los_Angeles');

job.start();

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify({ data: data }))
    } catch (err) {
        console.error(err)
        return (err.message)
    }
}

const loadData = (path) => {
    try {
        return JSON.parse(fs.readFileSync(path, 'utf8')).data
    } catch (err) {
        console.error(err)
        return (err.message)
    }
}

// Get from disk
db.backup = function backup() {
    console.log("===== backup ===== ")
    if (!global.listings || global.listings.length == 0) {
        global.listings = loadData('listings.json')
    }
    if (!global.listings || global.listings.length == 0) {
        global.listings = [{ title: 'title1', a: 0, d: 0, desc: 'oipfjezojifze', pass: 'qub7s1ya', tags: ["tag1", "tag2"] }]
        db.persist()
    }
    global.listings.forEach(item => {
        Object.defineProperty(item, 'desc_', {
            get: function () { return (smaz.decompress(this.desc)) }
        });
    });

}

// Set from disk
db.persist = function persist() {
    console.log("===== persist ===== ")
    storeData(global.listings, 'listings.json')
}

// Push item
db.push = function push(item) {
    console.log("===== push ===== ")
    // small memory gain.
    // item.desc = Uint8Array.from(item.desc)
    var ids = _.pluck(global.listings, 'id')
    if (!item.id || ids.indexOf(item.id) >= 0)
        return ('item without id or id is already there.')
    Object.defineProperty(item, 'desc_', {
        get: function () { return (smaz.decompress(this.desc)) }
    });
    global.listings.push(item)
}

// After some conditions persist
db.cycle = function cycle() {
    db.clean()
    db.persist()
    // db.backup()
}

// Purge deactivated items
db.clean = function clean() {
    console.log("===== clean ===== ")
    for (var i = 0; i < global.listings.length; i++) {
        if (global.listings[i].d) {
            global.listings.splice(i, 1);
        }
    }
}

// Get one
db.get = function get(query, subListing = global.listings) {
    console.log("===== get ===== ")
    return _.pick(_.findWhere(subListing, query), 'id', 'title', 'desc_')
}

// Deactivate one
db.deactivate = function deactivate(id, subListing = global.listings) {
    console.log("===== deactivate ===== ")
    return _.some(subListing, elem => {
        if (elem.id === id) {
            elem.d = 1;
            return true;
        }
    })
}

// Approve one
db.approve = function approve(id, subListing = global.listings) {
    console.log("===== approve ===== ")
    return _.some(subListing, elem => {
        if (elem.id === id) {
            elem.a = 1;
            return true;
        }
    })
}

// Fetch some
// sanitize for desc key before fetch
db.fetch = function fetch(query, subListing = global.listings) {
    console.log("===== fetch ===== ")
    var isEmpty = _.isEmpty(_.filter(_.values(query), elem => { return elem }))

    if (isEmpty)
        return subListing
    return _.where(subListing, query)
}


// Reject some
// query ~= function(item){ return item.title != 'blablab'; }
// sanitize for desc key before reject
db.rejectDeep = function rejectDeep(key, value, subListing = global.listings) {
    console.log("===== rejectDeep ===== ")
    if (!value)
        return subListing
    var query = (item) => {
        return sanitizeHtml(item[key], {
            allowedTags: [],
            allowedAttributes: {}
        }).toLowerCase().indexOf(value.toLowerCase()) > -1;
    }
    return _.reject(subListing, query)
}

// query ~= function(item){ return item.title == 'blablab'; }
// sanitize for desc key before filter
db.fetchDeep = function fetchDeep(key, value, subListing = global.listings) {
    console.log("===== fetchDeep ===== ")
    if (!value)
        return subListing
    var query = (item) => {
        return sanitizeHtml(item[key], {
            allowedTags: [],
            allowedAttributes: {}
        }).toLowerCase().indexOf(value.toLowerCase()) > -1;
    }
    return _.filter(subListing, query)
}

// fuzzy search on all
const MiniSearch = require('minisearch')
let miniSearch = new MiniSearch({
    fields: ['title', 'description'], // fields to index for full-text search
    idFields: 'id',
    storeFields: ['id', 'title', 'd', 'desc_'], // fields to return with search results
    extractField: (document, fieldName) => {
        if (fieldName === 'description') {
            const desc = document['desc_']
            return desc && sanitizeHtml(desc, {
                allowedTags: [],
                allowedAttributes: {}
            })
        }
        return document[fieldName]
    }
})

db.fuzzy = function fuzzy(str) {
    if (miniSearch.documentCount === 0)
        miniSearch.addAll(global.listings)
    return miniSearch.search(str).map(entrie => { return _.pick(entrie, 'id', 'title', 'desc_', 'd') })
}

// Sort
db.sortBy = function sortBy(key, asc, subListing = global.listings) {
    console.log("===== sortBy ===== ")
    return asc ? _.sortBy(subListing, key) : _.sortBy(subListing, key).reverse()
}

db.paginate = function paginate(length, subListing = global.listings) {
    console.log("===== paginate ===== ")
    return _.chunk(subListing, length)
}

db.sinceDelta = function sinceDelta(minutes, subListing = global.listings) {
    console.log("===== since ===== ")
    var now = Math.floor(new Date().getTime() / 1000)
    var then = now - minutes
    var compare = (item) => { return item.id > then; }
    return _.filter(subListing, compare)
}

db.since = function since(then, subListing = global.listings) {
    console.log("===== since ===== ")
    var compare = (item) => { return item.id > then; }
    return _.filter(subListing, compare)
}

// Default limit to 100
db.toPublic = function toPublic(limit = 999998, subListing = global.listings) {
    if (limit == 999998)
        return _.map(subListing.filter(elem => { return !elem.d && elem.a }), entrie => { return _.pick(entrie, 'id', 'title', 'desc_') })
    else
        return _.map(subListing.filter(elem => { return !elem.d && elem.a }), entrie => { return _.pick(entrie, 'id', 'title', 'desc_') }).slice(0, limit)
}

const sanitizeHtml = require('sanitize-html');
give.sanitize = function sanitize(str) {
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
const path = require('path')

// const merge = require('deepmerge')
var file_content = fs.readFileSync(path.join(__dirname, 'taxonomy-with-ids.en-US.txt')).toString().replace(',', '_').split("\n").filter(elem => { return elem });

const splitBy = sep => str =>
    str.split(sep).map(x => x.trim());

const splitLine = splitBy('-');
const splitCategories = splitBy('>');

const nest = xs =>
    xs.length === 2
        ? typeof xs[1] === 'string'
            ? { [xs[0]]: { id: xs[1] } }
            : { [xs[0]]: nest(xs[1]) }
        : nest([xs[0], xs.slice(1)]);

const load = lines =>
    // put all lines into a "container"
    // we want to process all lines all the time as opposed to each line individually
    [lines]
        // separate id and categories
        // e.g ['3237', 'Animals & Pet Supplies > Live Animals']
        .map(lines => lines.map(splitLine))
        // split categories and put id last
        // e.g. ['Animals & Pet Supplies', 'Live Animals', 3237]
        .map(lines => lines.map(([id, cats]) => splitCategories(cats)))
        .pop();


give.googleTags = _.uniq(load(file_content).filter(arr => { return arr.length == 3 }), function (x) { return x.join(''); })

// Author: Anthony Goldman https://github.com/jaideepchilukuri/jaideepch/blob/2bd3d43adbbf951d07420d9dac944a2f5eec76a8/tools/maintainance/EJS/emptyconfigs/19.11.0/src/survey/surveyutils.js
// Based on Richard's Ramblings Regex patterns.
give.cleanSensitive = function cleanSensitive(blob, maxlen) {
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

module.exports.db = db;
module.exports.give = give;
