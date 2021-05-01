// var db = require('./helper_data').db

// db.backup()
// // var vv = db.get({ pass: "ynfrwbv8w" })
// // console.log(vv)
// var array = global.listings
// var err = db.push({ "id": 77, "d": 1, "title": 4, "desc": "tell tell" })
// console.log(err)
// console.log(array.length)
// var err = db.push({ "id": 77, "d": 1, "title": 4, "desc": "tell tell1" })
// console.log(err)
// console.log(array.length)
// db.persist()

// db.clean()
// console.log(array.length)

// console.log(db.get({ id: 7 }))
// console.log(db.fetch({ id: 7 }))
// console.log(db.fetchDeep("desc_", "TELL"))
// console.log(db.rejectDeep("desc", "87"))

// console.log(db.sortBy("id", true))
// console.log(db.sortBy("id", false))

var fs = require("fs");
var text = fs.readFileSync("./arabic.txt").toString('utf-8');
var arabic = text.split("\n").slice(0, 245)

var { compatto, DecompressError } = require('compatto')
var english = require("./node_modules/compatto/cjs/dictionary.cjs").dictionary
const { compress, decompress } = compatto({ dictionary: arabic })
const compressedString = compress("يعمل الشمندر على إزالة السموم من الدم، ويساعد البرتقال في الحفاظ على البشرة والجسم، إذن ماذا يحدث عند مزج عصير الشمندر والبرتقال معًا؟ تعرف في هذا المقال على فوائد عصير الشمندر والبرتقال. ")
console.log(compressedString)
const decompressedString = decompress(compressedString)

fs.writeFile('text.txt', decompressedString, function (err) {
    if (err) return console.log(err);
  });