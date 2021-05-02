var _ = require('underscore');
const fs = require('fs')
var db = {}
var give = {}
var giveOp = require('./helper_ops').ops

// title: 'title1' => is a title
// a: 0 => approved by admin
// d: 0 => deactivated by user
// desc: 'oipfjezojifze' => extended description
// pass: 'qub7s1ya' => password to deactivate
// tags: ["tag1", "tag2"] => tags


const compress_images = require("compress-images");
const path = require('path');
const chokidar = require('chokidar');

const INPUT_path_images = "uploads/*.{jpg,JPG,jpeg,JPEG,png,PNG,svg,gif}";
const INPUT_path = "uploads/";
const OUTPUT_path = "public/images/";

var watcher = chokidar.watch(INPUT_path, { persistent: true });

watcher
    .on('add', function (path) {
        console.log('File', path, 'has been added');

        compress_images(INPUT_path_images, OUTPUT_path, { compress_force: false, statistic: true, autoupdate: true }, false,
            { jpg: { engine: "mozjpeg", command: ["-quality", "60"] } },
            { png: { engine: "pngquant", command: ["--quality=20-50", "-o"] } },
            { svg: { engine: "svgo", command: "--multipass" } },
            { gif: { engine: "gifsicle", command: ["--colors", "64", "--use-col=web"] } },
            function (error, completed, statistic) {
                console.log("-------------");
                console.log(error);
                console.log(completed);
                console.log(statistic);
                console.log("-------------");
                // CLEAN FOLDER.
                if (error === null) {
                    fs.unlink(statistic.input, (err) => {
                        if (err) throw err;
                        console.log('successfully compressed and deleted ' + statistic.input);
                    });
                }
            }
        );
    })
    .on('change', function (path) {
        console.log('File', path, 'has been changed');
    })
    .on('unlink', function (path) { console.log('File', path, 'has been removed'); })
    .on('error', function (error) { console.error('Error happened', error); })


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
            get: function () { 
                item.desc = Uint8Array.from(item.desc)
                return item.ara ? (giveOp.decompress_ar(item.desc)) : (giveOp.decompress_en(item.desc))
            }
        });
    });

}

// Set from disk
db.persist = function persist() {
    console.log("===== persist ===== ")
    global.listings.forEach(item => {
        item.desc = Array.from(item.desc)
    })
    storeData(global.listings, 'listings.json')
    global.listings.forEach(item => {
        item.desc = Uint8Array.from(item.desc)
    })
}

// Push item
db.push = function push(item) {
    console.log("===== push ===== ")
    // small memory gain.
    item.desc = Uint8Array.from(item.desc)
    var ids = _.pluck(global.listings, 'id')
    if (!item.id || ids.indexOf(item.id) >= 0)
        return ('item without id or id is already there.')
    Object.defineProperty(item, 'desc_', {
        get: function () { 
            return item.ara ? (giveOp.decompress_ar(item.desc)) : (giveOp.decompress_en(item.desc))
        }
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
db.get = function get(query, pick, subListing = global.listings) {
    console.log("===== get ===== ")
    return _.pick(_.findWhere(subListing, query), pick) //'id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara'
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
        return giveOp.sanitize(item[key], {
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
        return giveOp.sanitize(item[key], {
            allowedTags: [],
            allowedAttributes: {}
        }).toLowerCase().indexOf(value.toLowerCase()) > -1;
    }
    return _.filter(subListing, query)
}

// fuzzy search on all
const MiniSearch = require('minisearch');
const { ops } = require('./helper_ops');
let miniSearch = new MiniSearch({
    fields: ['title', 'description'], // fields to index for full-text search
    idFields: 'id',
    storeFields: ['id', 'title', 'd', 'desc_'], // fields to return with search results
    extractField: (document, fieldName) => {
        if (fieldName === 'description') {
            const desc = document['desc_']
            return desc && giveOp.sanitize(desc, {
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
    return miniSearch.search(str).map(entrie => { return _.pick(entrie, 'id', 'title', 'desc_', 'd', 'ara') })
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
        return _.map(subListing.filter(elem => { return !elem.d && elem.a }), entrie => { return _.pick(entrie, 'id', 'title', 'desc_', 'ara') })
    else
        return _.map(subListing.filter(elem => { return !elem.d && elem.a }), entrie => { return _.pick(entrie, 'id', 'title', 'desc_', 'ara') }).slice(0, limit)
}

// const merge = require('deepmerge')
var file_content = fs.readFileSync(path.join(__dirname, 'taxonomy-with-ids.ar-SA.txt')).toString().replace(',', '_').split("\n").filter(elem => { return elem });

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


module.exports.db = db;
module.exports.give = give;
