const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const lowdb = low(adapter);
lowdb.defaults({'donations': [], 'artworks': [], 'blogs': []}).write();

const item = {
  'title': 'the is just a random title',
  'tags': [],
  'desc': [],
  'lat': '36.75',
  'lng': '3.05',
  'id': 1621022495,
  'pass': 'q6hkp3mnj',
  'd': 0,
  'a': 1,
  'img': '1621022495266-210716662.jpg',
  'ara': null,
};

// lowdb.get('donations')
//     .push(item)
//     .write();

lowdb.get('donations')
    .find({id: 1621022495})
    .assign({d: 1})
    .write();

const first = lowdb.get('donations[0].title')
    .value();

console.log(first);
