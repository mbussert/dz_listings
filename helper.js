var _ = require('underscore');
const fs = require('fs')
var db = {}

// [{ t: 'title1', d: false, c: 'oipfjezojifze'}, { t: 'title2', d: false, c: 'oipfjezojifze' }, { t: 'title3', d: true, c: 'oipfjezojifze' }]

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
    console.log("===== DB +++++")
    console.log("===== backup +++++ ")
    if (!global.listings || global.listings.length == 0) {
        global.listings = loadData('listings.json')
    }
    if (!global.listings || global.listings.length == 0) {
        global.listings = [{ d: 0, MIS: 1 }, { d: 0, MIS: 3 }, { d: 1, MIS: 4 }]
        db.persist()
    }
}

// Set from disk
db.persist = function persist() {
    console.log("===== DB +++++")
    console.log("===== persist +++++ ")
    storeData(global.listings, 'listings.json')
}

// Push item
db.push = function push(item) {
    console.log("===== DB +++++")
    console.log("===== push +++++ ")
    var ids = _.pluck(global.listings, 'id')
    if (!item.id || ids.indexOf(item.id) >= 0)
        return ('item without id or id is already there.')
    global.listings.push(item)
}

// After some conditions persist
db.cycle = function cycle() {
    console.log("===== DB +++++")
    console.log("===== cycle +++++ ")
}

// Purge deactivated items
db.clean = function clean() {
    console.log("===== DB +++++")
    console.log("===== clean +++++ ")
    for (var i = 0; i < global.listings.length; i++) {
        if (global.listings[i].d) {
            global.listings.splice(i, 1);
            break;
        }
    }
}

// Get one
db.get = function get(query) {
    console.log("===== DB +++++")
    console.log("===== get +++++ ")
    return _.findWhere(global.listings, query)
}

// With limit and order
db.fetch = function fetch(query) {
    console.log("===== DB +++++")
    console.log("===== fetch +++++ ")
    return _.where(global.listings, query)
}

// Reject some
// query ~= function(item){ return item.title != 'blablab'; }
db.rejectDeep = function rejectDeep(key, value) {
    console.log("===== DB +++++")
    console.log("===== rejectDeep +++++ ")
    query = (item) => { return item[key].indexOf(value) > -1; }
    return _.reject(global.listings, query)
}

// query ~= function(item){ return item.title != 'blablab'; }
db.fetchDeep = function fetchDeep(key, value) {
    console.log("===== DB +++++")
    console.log("===== fetchDeep +++++ ")
    query = (item) => { return item[key].indexOf(value) > -1; }
    return _.filter(global.listings, query)
}

// sort
db.sortBy = function sortBy(key, asc) {
    console.log("===== DB +++++")
    console.log("===== sortBy +++++ ")
    return asc ? _.sortBy(global.listings, key) : _.sortBy(global.listings, key).reverse()
}

db.paginate = function paginate(length) {
    console.log("===== DB +++++")
    console.log("===== paginate +++++ ")
    return _.chunk(global.listings, length)
}

module.exports.db = db;
