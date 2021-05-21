/**
 * Self contained test file, dependes only on helper_data.js and helper_ops.js
 */

var db = require('./helper_data').db
// var giveOp = require('./helper_ops').ops

// db.backup()
// var vv = db.get({ "title":"titlevsvsvsvsvsvs" }, ['id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara', 'usr', 'd'])
// console.log(global.listings)

// db.sortDB()
// console.log(global.listings)

// var res = db.deactivate(1619916741)
// console.log(res)
// var vv = db.get({ "title":"titlevsvsvsvsvsvs" }, ['id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara', 'usr', 'd'])
// console.log(vv)

// console.log(db.fetch({ id: 1619916741 }))

// var array = global.listings
// console.log(array)
// var array2 = db.toPublic(array)
// console.log(array2)
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

// var fs = require("fs");
// var text = fs.readFileSync("./arabic.txt").toString('utf-8');
// var arabic = text.split("\n").slice(0, 245)

// var { compatto, DecompressError } = require('compatto')
// var english = require("./node_modules/compatto/cjs/dictionary.cjs").dictionary
// const { compress, decompress } = compatto({ dictionary: arabic })
// const compressedString = compress("يعمل الشمندر على إزالة السموم من الدم، ويساعد البرتقال في الحفاظ على البشرة والجسم، إذن ماذا يحدث عند مزج عصير الشمندر والبرتقال معًا؟ تعرف في هذا المقال على فوائد عصير الشمندر والبرتقال. ")
// console.log(compressedString)
// const decompressedString = decompress(compressedString)

// fs.writeFile('text.txt', decompressedString, function (err) {
//     if (err) return console.log(err);
// });

elem = db.get({ id: 1621591288, d: 0, a: 1 }, ['id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara', 'usr'])
console.log(JSON.stringify(elem))
// console.log(giveOp.compress_en("hello world"))

const glob = require('glob');

// options is optional
glob('**/data/db/*.json', function(er, files) {
  console.log(files[0]);
  // files is an array of filenames.
  // If the `nonull` option is set, and nothing
  // was found, then files is ["**/*.js"]
  // er is an error object or null.
});

const fs = require('fs');
const path = require('path');

const getMostRecentFile = (dir) => {
  const files = orderReccentFiles(dir);
  return files.length ? files[0] : undefined;
};

const orderReccentFiles = (dir) => {
  return fs.readdirSync(dir)
      .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
      .map((file) => ({file, mtime: fs.lstatSync(path.join(dir, file)).mtime}))
      .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};

console.log(getMostRecentFile('./data/db/'));

const now = new Date();
const logfile_name = './data/db/listings_'+
now.getFullYear() +
'-'+ now.getMonth() +
'-' + now.getDate() +
'.json';
