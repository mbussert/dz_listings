var db = require('./helper').db

db.backup()

var array = global.listings

console.log(array.data.length)

