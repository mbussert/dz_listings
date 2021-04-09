var db = require('./helper').db

db.backup()

var array = global.listings
var err = db.push({ "id": 2, "d": 1, "title": 4 })
console.log(err)
console.log(array.length)
var err = db.push({ "id": 7, "d": 1, "title": 4 })
console.log(err)
console.log(array.length)
db.persist()

db.clean()
console.log(array.length)

console.log(db.get({ id: 7 }))
console.log(db.fetch({ title: 3 }))
console.log(db.fetchDeep("desc", "87"))
console.log(db.rejectDeep("desc", "87"))

console.log(db.sortBy("id", true))
console.log(db.sortBy("id", false))