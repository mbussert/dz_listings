var express = require('express');
var router = express.Router();
var db = require('../helper_data').db
var giveData = require('../helper_data').give
var _ = require('underscore');
const dotenv = require('dotenv')
dotenv.config()
// { "id": 0, "d": 0, "title": 3, "desc": "dqs878dsq" }
/* GET listings not including deactivated. */

// Shows listings since 7 days.
router.get('/', function (req, res, next) {
  var listings = db.toPublic(100)
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 7);
  var since = Math.floor(yesterday.getTime() / 1000)
  listings = db.since(since, listings)
  res.render('listings', { title: 'DZ Listings', intro: 'Like newspapers listings, this is a digital one open for all Algerians', listings: listings, user: req.session.user, success: "Hello there :)", sec: "index" });
});

router.get('/donations', function (req, res, next) {
  var pubListings = db.toPublic(100, 'don')
  res.render('listings', { title: 'DZ Listings', intro: 'Share or look for used items nextdoor, Based on solidarity and reciprocity rather than economic profit', listings: pubListings, user: req.session.user, success: "Hello there :)", sec: "don" });
});

router.get('/artworks', function (req, res, next) {
  var pubListings = db.toPublic(100, 'art')
  console.log(pubListings)
  res.render('listings', { title: 'DZ Listings', intro: 'Share website or digital assets or any other artwork', listings: pubListings, user: req.session.user, success: "Hello there :)", sec: "art" });
});

router.get('/blogs', function (req, res, next) {
  var pubListings = db.toPublic(100, 'blo')
  res.render('listings', { title: 'DZ Listings', intro: 'Share your passions, hobbies and passtimes! Whether it is a creative or enriching', listings: pubListings, user: req.session.user, success: "Hello there :)", sec: "blo" });
});

router.get('/get_tags', function (req, res, next) {
  res.status(200).json({ tags: giveData.googleTags });
});

router.get('/get_tags_lite', function (req, res, next) {
  res.status(200).json({ tags: giveData.googleTagsLite });
});

router.get('/tags', function (req, res, next) {
  res.render('tags', { title: 'Express', user: req.session.user, success: "Hello there :)" });
});

/* GET one listing; must not be deactivated. */
router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id)
  var elem = db.get({ id: id, d: 0, a: 1 }, ['id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara', 'tags', 'sec'])
  if (_.isEmpty(elem))
    res.render('listing', { title: 'Express', data: elem, user: req.session.user, error: "No listing found, it can be deactivated or not approved yet :(" });
  else
    res.render('listing', { title: 'Express', data: elem, user: req.session.user, success: "Yep :)", sec: elem.sec });
});

// https://regex101.com/r/1Q2EcU/1
// Working, téomorrow with Jude.
/* Query listings not including deactivated. */
router.post('/query', async (req, res, next) => {
  const { body } = req;
  var listings = global.listings
  const querySchema = Joi.object().keys({
    title: Joi.string().optional().allow('').min(3).max(100).regex(/^\W*\w+(?:\W+\w+)*\W*$/),
    exactTitle: Joi.boolean().truthy('on').falsy('off').default(false),
    desc: Joi.string().optional().allow('').min(10).max(500),
    exactDesc: Joi.boolean().truthy('on').falsy('off').default(false),
    since: Joi.date().iso()
  }).or('title', 'desc');

  const result = querySchema.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {

    if (body.exactTitle)
      listings = db.fetch({ title: body.title }, listings)
    else
      listings = db.fetchDeep('title', body.title, listings)
    if (body.exactDesc)
      listings = db.fetch({ desc_: body.desc }, listings)
    else
      listings = db.fetchDeep('desc_', body.desc, listings)
  }
  var then = Math.floor(new Date(body.since).getTime() / 1000)
  listings = db.since(then, listings)

  res.render('listings', { title: 'Express', listings: db.toPublic(100, listings), user: req.session.user, success: "Yep, we got some :)" });
});

/* Query listings not including deactivated. */
router.post('/queryV2', async (req, res, next) => {
  const { body } = req;
  const querySchema = Joi.object().keys({
    title_desc: Joi.string().optional().allow('').min(3).max(100).regex(/^\W*\w+(?:\W+\w+)*\W*$/),
    since: Joi.date().iso()
  });

  const result = querySchema.validate(body);
  const { value, error } = result;
  const valid = error == null;
  var listings;
  if (!valid) {
    // TODO: check this
    res.render('listing', { title: 'Express', data: [], error: "No listing found :(" });
  } else {
    listings = db.fuzzy(body.title_desc)
  }
  console.log(listings)
  var then = Math.floor(new Date(body.since).getTime() / 1000)
  listings = db.since(then, listings)
  // sec: "index"
  res.render('listings', { title: 'Express', listings: db.toPublic(100, listings), user: req.session.user, success: "Yep, we got some :)" });
});

/* Add one listing. */
const Joi = require('joi');


var giveObj = require('../helper_ops').give
var giveOp = require('../helper_ops').ops
var arabic = /[\u0600-\u06FF]/g;
function isArabic(str) {
  var count = str.match(arabic)
  return count && ((count.length / str.length) > 0.5)
}
router.post('/add', /*global.passwordless.restricted({ failureRedirect: '/login' }),*/ giveObj.upload.single('avatar'), async (req, res, next) => {
  const { body } = req;
  const listingSchema = Joi.object().keys({
    title: Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).min(10).max(100).required(),
    desc: Joi.string().min(10).max(5000).required(),
    tags: Joi.array().items(Joi.string().min(3).max(20)).required(),
    lat: Joi.number().max(90).min(-90).optional(),
    lng: Joi.number().max(180).min(-180).optional(),
    sec: Joi.string().valid('don').required()
    // avatar: Joi.string().required()
  });
  var tags;
  var validJson = true
  try {
    tags = JSON.parse(body.tags)
    body.tags = _.pluck(tags, 'value')
  } catch (e) {
    validJson = false
  }
  var validPoint = true
  validPoint = giveOp.isPointInsidePolygon({ lat: body.lat, lng: body.lng })
  const result = listingSchema.validate(body);
  const { value, error } = result;
  valid = (error == null) && validJson && validPoint;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {
    var password = (Math.random().toString(36).substr(4)).slice(0, 9)
    var now = Math.floor(new Date().getTime() / 1000)
    var htmlCleanDesc = giveOp.sanitize(body.desc)
    var maskedDesc = giveOp.cleanSensitive(htmlCleanDesc)
    body.desc = isArabic(maskedDesc) ? giveOp.compress_ar(maskedDesc) : giveOp.compress_en(maskedDesc)
    var entry = _.extend(body, { id: now, pass: password, d: 0, a: 1, img: req.file.filename, usr: req.session.user, ara: isArabic(maskedDesc) })
    var err = db.push(entry)
    console.log('))))))))))))))')
    console.log(err)
    // TODO: not here, in a cron job
    db.persist()
    if (!err) {
      giveOp.mail(`<a href="https://dzlistings.com/listings/${pass2}/${entry.id}">check</a><br><br><hr><a href="https://dzlistings.com/listings/${pass}/${entry.id}">approve</a> `)
      res.render('listing', { title: 'One listing', data: entry, user: req.session.user, success: "Success. Here is the password whenever you want to deactivate the listing :)", error: "Image will be loaded shortly!" })
    }
    else
      // if error
      res.render('listing', { title: 'Express', data: err, error: "Oops, an error accured :(" });
  }
});

router.post('/add2', /*global.passwordless.restricted({ failureRedirect: '/login' }),*/ giveObj.upload.single('avatar'), async(req, res, next) => {
  const { body } = req;
  const listingSchema = Joi.object().keys({
    title: Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).min(10).max(100).required(),
    desc: Joi.string().min(10).max(5000).required(),
    tags: Joi.array().items(Joi.string().min(3).max(20)).required(),
    sec: Joi.string().valid('art').required()
    // avatar: Joi.string().required()
  });
  var tags;
  var validJson = true
  try {
    tags = JSON.parse(body.tags)
    body.tags = _.pluck(tags, 'value')
  } catch (e) {
    validJson = false
  }
  const result = listingSchema.validate(body);
  const { value, error } = result;
  valid = (error == null) && validJson;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {
    var password = (Math.random().toString(36).substr(4)).slice(0, 9)
    var now = Math.floor(new Date().getTime() / 1000)
    var htmlCleanDesc = giveOp.sanitize(body.desc)
    var maskedDesc = giveOp.cleanSensitive(htmlCleanDesc)
    body.desc = isArabic(maskedDesc) ? giveOp.compress_ar(maskedDesc) : giveOp.compress_en(maskedDesc)
    var entry = _.extend(body, { id: now, pass: password, d: 0, a: 1, img: req.file.filename, usr: req.session.user, ara: isArabic(maskedDesc) })
    var err = db.push(entry)
    console.log(err)
    // TODO: not here, in a cron job
    db.persist()
    if (!err) {
      giveOp.mail(`<a href="https://dzlistings.com/listings/${pass2}/${entry.id}">check</a><br><br><hr><a href="https://dzlistings.com/listings/${pass}/${entry.id}">approve</a> `)
      res.render('listing', { title: 'One listing', data: entry, user: req.session.user, success: "Success. Here is the password whenever you want to deactivate the listing :)", error: "Image will be loaded shortly!" })
    }
    else
      // if error
      res.render('listing', { title: 'Express', data: err, error: "Oops, an error accured :(" });
  }
});

/* Deactivate one listing. */
router.post('/deactivate', function (req, res, next) {
  const { body } = req;
  const listing = Joi.object().keys({
    password: Joi.string().min(6).max(9).required(),
  });
  const result = listing.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {
    var elem = db.get({ pass: body.password }, ['id'])
    db.deactivate(elem.id)
    res.render('messages', { title: 'Express', message: 'Item deactivated', user: req.session.user, success: "Listing has been successfully deactivated. Users will not see it again :)" });
  }
});

/* Contact poster one listing. */
router.post('/contact', global.passwordless.restricted({ failureRedirect: '/login' }), function (req, res, next) {
  const { body } = req;
  const listing = Joi.object().keys({
    message: Joi.string().min(20).required(),
    id: Joi.string().min(8).max(11).required(),
  });
  const result = listing.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {
    var elem = db.get({ id: parseInt(body.id), d: 0, a: 1 }, ['usr'])
    if (_.isEmpty(elem))
      res.render('listing', { title: 'messages', message: 'You cannot send an email to the item\'s publisher', user: req.session.user, error: 'You cannot send an email to the item\'s publisher' });

    // mail2(message, EMAIL_RECIEVER, EMAIL_SENDER, subjectId)
    var mail = { message: body.message, EMAIL_SENDER: req.user, EMAIL_RECIEVER: elem.usr, subjectId: body.id }
    console.log(mail)
    giveOp.mail2(mail)
    res.render('listing', { title: 'messages', message: 'Email successfully sent to publisher, he may repond to you.', user: req.session.user, success: 'Email successfully sent to publisher' });
  }
});


let pass = process.env.PASS
let pass2 = process.env.PASS2

/* GET one listing; must not be unnapproved yet. */
router.get(`/${pass2}/:id`, function (req, res, next) {
  var id = parseInt(req.params.id)
  var elem = db.get({ id: id, d: 0, a: 0 }, ['id', 'title', 'desc_', 'lat', 'lng', 'img', 'ara'])
  if (_.isEmpty(elem))
    res.render('listing', { title: 'Express', data: elem, error: "No listing found, it can be deactivated or not approved yet :(" });
  else
    res.render('listing', { title: 'Express', data: elem, success: "Yep :)" });
});


/* Approve one listing. */
router.get(`/${pass}/:id`, function (req, res, next) {
  var id = parseInt(req.params.id)
  var elem = db.get({ id: id, a: 0 }, ['id'])

  if (_.isEmpty(elem))
    res.render('messages', { title: 'Express', message: 'Item approval', error: "Listing not found or already approved" });
  var success = db.approve(elem.id)
  if (success) {
    res.render('messages', { title: 'Express', message: 'Item approval', success: "Listing has been successfully approved :)" });
  }
});


module.exports = router;
