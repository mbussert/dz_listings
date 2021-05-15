const _ = require('underscore');
const lo = require('lodash');
const fs = require('fs');
const db = {};
const give = {};
const giveOp = require('./helper_ops').ops;

// title: 'title1' => is a title
// a: 0 => approved by admin
// d: 0 => deactivated by user
// desc: 'oipfjezojifze' => extended description
// pass: 'qub7s1ya' => password to deactivate
// tags: ["tag1", "tag2"] => tags


const compressImages = require('compress-images');
const path = require('path');
const chokidar = require('chokidar');

const inputPathImages = 'uploads/*.{jpg,JPG,jpeg,JPEG,png,PNG,svg,gif}';
const inputPath = 'uploads/';
const outputPath = 'public/images/';

const watcher = chokidar.watch(inputPath, {persistent: true});

watcher
    .on('add', function(path) {
      console.log('File', path, 'has been added');
      compressImages(
          inputPathImages,
          outputPath,
          {compress_force: false, statistic: true, autoupdate: true},
          false,
          {jpg: {engine: 'mozjpeg', command: ['-quality', '60']}},
          {png: {engine: 'pngquant', command: ['--quality=20-50', '-o']}},
          {svg: {engine: 'svgo', command: '--multipass'}},
          {gif: {engine: 'gifsicle', command: ['--colors', '64', '--use-col=web']}},
          function(error, completed, statistic) {
            console.log('-------------');
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log('-------------');
            // CLEAN FOLDER.
            if (error === null) {
              fs.unlink(statistic.input, (err) => {
                if (err) throw err;
                console.log('successfully compressed and deleted ' + statistic.input);
              });
            }
          },
      );
    })
    .on('change', function(path) {
      console.log('File', path, 'has been changed');
    })
    .on('unlink', function(path) {
      console.log('File', path, 'has been removed');
    })
    .on('error', function(error) {
      console.error('Error happened', error);
    });


// Clean and persist every 3 hours
const CronJob = require('cron').CronJob;
const job = new CronJob('0 0 */3 * * *', function() {
  console.log('===== cycle ===== ');
  db.cycle();
}, null, true, 'America/Los_Angeles');

if (process.env.NODE_ENV === 'prod') {
  job.start();
}


const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify({data: data}));
  } catch (err) {
    console.error(err);
    return (err.message);
  }
};

const loadData = (path) => {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf8')).data;
  } catch (err) {
    console.error(err);
    return (err.message);
  }
};

db.sortDB = function sortDB() {
  console.log('===== sortDB ===== ');
  global.listings = lo.sortBy(global.listings, function(o) {
    return o.id;
  });
};

// Get from disk
db.backup = function backup() {
  console.log('===== backup ===== ');
  if (!global.listings || global.listings.length == 0) {
    global.listings = loadData('listings.json');
  }
  if (!global.listings || global.listings.length == 0) {
    global.listings = [
      {
        'title': 'title1',
        'a': 0,
        'd': 0,
        'desc': 'oipfjezojifze',
        'pass': 'qub7s1ya',
        'sec': 'don',
        'ara': null,
        'date': 'May 5, 2021',
        'tags': [
          'tag1',
          'tag2',
        ],
      },
    ];
    db.persist();
  }
  global.listings.forEach((item) => {
    Object.defineProperty(item, 'desc_', {
      get: function() {
        item.desc = Uint8Array.from(item.desc);
        const tmp = item.desc;
        return item.ara ?
        giveOp.decompress_ar(tmp) :
        giveOp.decompress_en(tmp);
      },
    });
  });
};

// create or refresh pubView
db.setView = function setView() {
  console.log('===== set view ===== ');
  const listings = db.toPublic();
  const yesterday = new Date();
  const days = process.env.NODE_ENV === 'prod' ? 10 : 1000;
  yesterday.setDate(yesterday.getDate() - days);
  const since = Math.floor(yesterday.getTime() / 1000);
  global.pubView = db.since(since, listings);
};

// Set from disk
db.persist = function persist() {
  console.log('===== persist ===== ');
  global.listings.forEach((item) => {
    item.desc = Array.from(item.desc);
  });
  storeData(global.listings, 'listings.json');
  global.listings.forEach((item) => {
    item.desc = Uint8Array.from(item.desc);
  });
};

// Push item
db.push = function push(item) {
  console.log('===== push ===== ');
  // small memory gain.
  item.desc = Uint8Array.from(item.desc);
  const ids = _.pluck(global.listings, 'id');
  if (!item.id || ids.indexOf(item.id) >= 0) {
    return ('item without id or id is already there.');
  }
  Object.defineProperty(item, 'desc_', {
    get: function() {
      const tmp = item.desc;
      return item.ara ?
      giveOp.decompress_ar(tmp) :
      giveOp.decompress_en(tmp);
    },
  });
  global.listings.push(item);
};

// After some conditions persist
db.cycle = function cycle() {
  // These are greedy operations !
  db.clean();
  db.sortDB();
  db.setView();
  db.persist();
  // db.backup()
};

// Purge deactivated items
// Should only be called from time to time (because of splice)
db.clean = function clean() {
  console.log('===== clean ===== ');
  for (let i = 0; i < global.listings.length; i++) {
    if (global.listings[i].d) {
      global.listings.splice(i, 1);
    }
  }
};

// Get one
db.get = function get(query, keys, subListing = global.listings) {
  console.log('===== get ===== ');
  // 'id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara'
  return lo.pick(lo(subListing).find(query), keys);
  // return _.pick(_.findWhere(subListing, query), keys).desc_
};

// Deactivate one
db.deactivate = function deactivate(id, subListing = global.listings) {
  console.log('===== deactivate ===== ');
  return lo.some(subListing, (elem) => {
    if (elem.id === id) {
      elem.d = 1;
      return true;
    }
  });
};

// Approve one
db.approve = function approve(id, subListing = global.listings) {
  console.log('===== approve ===== ');
  return lo.some(subListing, (elem) => {
    if (elem.id === id) {
      elem.a = 1;
      return true;
    }
  });
};

// Fetch some
// sanitize for desc key before fetch
db.fetch = function fetch(query, subListing = global.listings) {
  console.log('===== fetch ===== ');
  return lo.filter(subListing, query);
  // return _.where(subListing, query)
};

// Fetch based on tags
// sanitize for desc key before fetch
db.fetchByTag = function fetchByTag(tag, subListing = global.listings) {
  console.log('===== fetchByTag ===== ');
  const compare = (item) => item.tags.indexOf(tag) > -1;
  return lo.filter(subListing, compare);
  // return _.where(subListing, query)
};


// Reject some
// query ~= function(item){ return item.title != 'blablab'; }
// sanitize for desc key before reject
db.rejectDeep = function rejectDeep(key, value, subListing = global.listings) {
  console.log('===== rejectDeep ===== ');
  const query = (item) => {
    return giveOp.sanitize(item[key], {
      allowedTags: [],
      allowedAttributes: {},
    }).toLowerCase().indexOf(value.toLowerCase()) > -1;
  };
  return lo.reject(subListing, query);
  // return _.reject(subListing, query)
};

// query ~= function(item){ return item.title == 'blablab'; }
// sanitize for desc key before filter
db.fetchDeep = function fetchDeep(key, value, subListing = global.listings) {
  console.log('===== fetchDeep ===== ');
  const query = (item) => {
    return giveOp.sanitize(item[key], {
      allowedTags: [],
      allowedAttributes: {},
    }).toLowerCase().indexOf(value.toLowerCase()) > -1;
  };
  return lo.filter(subListing, query);
  // return _.filter(subListing, query)
};

// fuzzy search on all
const MiniSearch = require('minisearch');
const miniSearch = new MiniSearch({
  // fields to index for full-text search
  fields: ['title', 'description'],
  idFields: 'id',
  // fields to return with search results
  storeFields: ['id', 'title', 'd', 'desc_', 'a', 'date'],
  extractField: (document, fieldName) => {
    if (fieldName === 'description') {
      const desc = document['desc_'];
      return desc && giveOp.sanitize(desc, {
        allowedTags: [],
        allowedAttributes: {},
      });
    }
    return document[fieldName];
  },
});

db.fuzzy = function fuzzy(str) {
  if (miniSearch.documentCount === 0) {
    miniSearch.addAll(global.listings);
  }
  return miniSearch.search(str);
};

// Sort
db.sortBy = function sortBy(key, asc, subListing = global.listings) {
  console.log('===== sortBy ===== ');
  return asc ?
  _.sortBy(subListing, key) :
  _.sortBy(subListing, key).reverse();
};

db.paginate = function paginate(length, subListing = global.listings) {
  console.log('===== paginate ===== ');
  return _.chunk(subListing, length);
};

db.sinceDelta = function sinceDelta(minutes, subListing = global.listings) {
  console.log('===== since ===== ');
  const now = Math.floor(new Date().getTime() / 1000);
  const then = now - minutes;
  const compare = (item) => item.id > then;
  return lo.filter(subListing, compare);
  // return _.filter(subListing, compare)
};

db.since = function since(then, subListing = global.listings) {
  console.log('===== since ===== ');
  const compare = (item) => item.id > then;
  return lo.filter(subListing, compare);
  // return _.filter(subListing, compare)
};

/**
 * Adds two numbers together.
 * @param {int} epoch valide epoch number
 * @param {object} entrie object with object.ara true or false.
 * @return {string} formatted date
 */
function formatDate(epoch, entrie) {
  const local = entrie.ara === true ? 'ar-dz' : 'en-gb';
  const d = new Date(0);
  d.setUTCSeconds(epoch);
  return d.toLocaleDateString(
      local,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      },
  );
}

// Default limit to 100
db.toPublic = function toPublic(limit = 9999999, sec = '', subListing = global.listings) {
  return lo(subListing).filter((elem) => {
    return !elem.d && elem.a && (!sec.length || elem.sec === sec );
  }).map((entrie) => {
    entrie.date = formatDate(entrie.id, entrie);
    return _.pick(entrie, 'id', 'title', 'desc_', 'ara', 'date', 'tags', 'sec');
  }).take(limit).value();
};

// const merge = require('deepmerge')
const taxonomyPath = '/taxonomy/taxonomy-with-ids.ar-SA.txt';
const fileSync = fs.readFileSync(path.join(__dirname, taxonomyPath)).toString();
const fileContent = fileSync.replace(',', '_').split('\n').filter(Boolean);
const splitBy = (sep) => (str) =>
  str.split(sep).map((x) => x.trim());

const splitLine = splitBy('-');
const splitCategories = splitBy('>');

const load = (lines) =>
// put all lines into a "container"
// we want to process all lines all the time as opposed to each line individually
  [lines]
  // separate id and categories
  // e.g ['3237', 'Animals & Pet Supplies > Live Animals']
      .map((lines) => lines.map(splitLine))
  // split categories and put id last
  // e.g. ['Animals & Pet Supplies', 'Live Animals', 3237]
      .map((lines) => lines.map(([id, cats]) => splitCategories(cats)))
      .pop();


give.googleTags = _.uniq(
    load(fileContent).filter((arr) => arr.length == 3), (x) => x.join(''),
);
give.googleTagsLite = give.googleTags.map((elem) => elem[2]);

module.exports.db = db;
module.exports.give = give;
