var _ = require('underscore');
const fs = require('fs')
var db = {}

// [{ title: 'title1', d: false, c: 'oipfjezojifze'}, { title: 'title2', d: false, c: 'oipfjezojifze' }, { title: 'title3', d: true, c: 'oipfjezojifze' }]

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
        global.listings = [{ title: 'title1', d: false, desc: 'oipfjezojifze' }]
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
db.get = function get(subListing=global.listings, query) {
    console.log("===== DB +++++")
    console.log("===== get +++++ ")
    return _.findWhere(subListing, query)
}

// Get one
db.deactivate = function deactivate(subListing=global.listings, id) {
    console.log("===== DB +++++")
    console.log("===== get +++++ ")
    return _.some(subListing, elem => {
        if (elem.title === id) {
            elem.d = 1;
            return true;
        }
    })
}


// With limit and order
db.fetch = function fetch(subListing=global.listings, query) {
    console.log("===== DB +++++")
    console.log("===== fetch +++++ ")
    return _.where(subListing, query)
}

// Reject some
// query ~= function(item){ return item.title != 'blablab'; }
db.rejectDeep = function rejectDeep(subListing=global.listings, key, value) {
    console.log("===== DB +++++")
    console.log("===== rejectDeep +++++ ")
    var query = (item) => { return item[key].toLowerCase().indexOf(value.toLowerCase()) > -1; }
    return _.reject(subListing, query)
}

// query ~= function(item){ return item.title != 'blablab'; }
db.fetchDeep = function fetchDeep(subListing=global.listings, key, value) {
    console.log("===== DB +++++")
    console.log("===== fetchDeep +++++ ")
    var query = (item) => { return item[key].toLowerCase().indexOf(value.toLowerCase()) > -1; }
    return _.filter(subListing, query)
}

// sort
db.sortBy = function sortBy(subListing=global.listings, key, asc) {
    console.log("===== DB +++++")
    console.log("===== sortBy +++++ ")
    return asc ? _.sortBy(subListing, key) : _.sortBy(subListing, key).reverse()
}

db.paginate = function paginate(subListing=global.listings, length) {
    console.log("===== DB +++++")
    console.log("===== paginate +++++ ")
    return _.chunk(subListing, length)
}

db.since = function since(subListing=global.listings, minutes) {
    console.log("===== DB +++++")
    console.log("===== since +++++ ")
    var now = Math.floor(new Date().getTime() / 1000)
    var then = now - minutes
    var compare = (item) => { return item.id > then; }
    return _.filter(subListing, compare)
}

// Default limit to 100
db.toPublic = function toPublic() {
    return _.map(global.listings, entrie => { return _.pick(entrie, 'id', 'title', 'desc') }).filter(elem => { return !elem.deactivate }).slice(0, 100)
}

module.exports.db = db;
