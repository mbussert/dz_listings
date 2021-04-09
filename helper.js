var _ = require('underscore');
const fs = require('fs')
var db = {}

// [{ t: 'title1', d: false, MIS: 1 }, { t: 'title2', d: false, MIS: 3 }, { t: 'title3', d: true, MIS:4}]

const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
        return (err.message)
    }
}

const loadData = (path) => {
    try {
        return fs.readFileSync(path, 'utf8')
    } catch (err) {
        console.error(err)
        return (err.message)
    }
}

// Get from disk
db.backup = function backup() {
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
    storeData(global.listings, 'listings.json')
}

// Push item
db.push = function push(item) {
    var ids = _.pluck(global.listings, 'id')
    if (!item.id || item.id in ids)
        return ('item without id or id is already there.')
    global.listings.push(item)
}

// After some conditions persist
db.cycle = function cycle() {

}

// Purge deactivated items
db.clean = function clean() {
    for (var i = 0; i < global.listings.length; i++) {
        if (global.listings[i].d) {
            global.listings.splice(i, 1);
            break;
        }
    }
}

// get one with ID
db.get = function get() {

}

// With limit and order
db.fetch = function fetch() {

}

module.exports.db = db;
