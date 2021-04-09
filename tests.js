var db = require('./helper').db

db.backup()

var array = global.listings
var err = db.push({"id": 2, "d": 1, "MIS": 4})
console.log(err)
console.log(array.length)
var err = db.push({"id": 7, "d": 1, "MIS": 4})
console.log(err)
console.log(array.length)
db.persist()

db.clean()
console.log(array.length)