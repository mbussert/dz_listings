var db = require('./helper_data').db

db.backup()
// var vv = db.get({ pass: "ynfrwbv8w" })
// console.log(vv)
var array = global.listings
var err = db.push({ "id": 77, "d": 1, "title": 4, "desc": "tell tell" })
console.log(err)
console.log(array.length)
var err = db.push({ "id": 77, "d": 1, "title": 4, "desc": "tell tell1" })
console.log(err)
console.log(array.length)
db.persist()

db.clean()
console.log(array.length)

console.log(db.get({ id: 7 }))
console.log(db.fetch({ id: 7 }))
console.log(db.fetchDeep("desc_", "TELL"))
// console.log(db.rejectDeep("desc", "87"))

// console.log(db.sortBy("id", true))
// console.log(db.sortBy("id", false))