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
db.get = function get(query) {
    console.log("===== DB +++++")
    console.log("===== get +++++ ")
    return _.findWhere(global.listings, query)
}

// Get one
db.deactivate = function deactivate(id) {
    console.log("===== DB +++++")
    console.log("===== get +++++ ")
    return _.some(global.listings, elem => {
        if (elem.title === id) {
            elem.d = 1;
            return true;
        }
    })
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
    var query = (item) => { return item[key].indexOf(value) > -1; }
    return _.reject(global.listings, query)
}

// query ~= function(item){ return item.title != 'blablab'; }
db.fetchDeep = function fetchDeep(key, value) {
    console.log("===== DB +++++")
    console.log("===== fetchDeep +++++ ")
    var query = (item) => { return item[key].indexOf(value) > -1; }
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

db.since = function since(minutes) {
    console.log("===== DB +++++")
    console.log("===== since +++++ ")
    var now = Math.floor(new Date().getTime() / 1000)
    var then = now - minutes
    var compare = (item) => { return item.id > then; }
    return _.filter(global.listings, compare)
}

module.exports.db = db;
