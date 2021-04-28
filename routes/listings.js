var express = require('express');
var router = express.Router();
var db = require('../helper_data').db
var giveData = require('../helper_data').give
var _ = require('underscore');
const dotenv = require('dotenv')
dotenv.config()
// { "id": 0, "d": 0, "title": 3, "desc": "dqs878dsq" }
/* GET listings not including deactivated. */

router.get('/', function (req, res, next) {
  var pubListings = db.toPublic(100)
  res.render('listings', { title: 'Express', listings: pubListings, success: "Hello there :)" });
});

router.get('/get_tags', function (req, res, next) {
  res.status(200).json({ tags: giveData.googleTags });
  // res.json(200, { tags: giveData.googleTags });
});

router.get('/tags', function (req, res, next) {
  res.render('tags', { title: 'Express', success: "Hello there :)" });
});

/* GET one listing; must not be deactivated. */
router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id)
  var elem = db.get({ id: id, d: 0, a: 1 })
  if (_.isEmpty(elem))
    res.render('listing', { title: 'Express', data: elem, error: "No listing found, it can be deactivated or not approved yet :(" });
  else
    res.render('listing', { title: 'Express', data: elem, success: "Yep :)" });
});

// https://regex101.com/r/1Q2EcU/1
// Working, téomorrow with Jude.
/* Query listings not including deactivated. */
router.post('/query', async (req, res, next) => {
  const { body } = req;
  var activeListings = db.toPublic()

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
      activeListings = db.fetch({ title: body.title }, activeListings)
    else
      activeListings = db.fetchDeep('title', body.title, activeListings)
    if (body.exactDesc)
      activeListings = db.fetch({ desc_: body.desc }, activeListings)
    else
      activeListings = db.fetchDeep('desc_', body.desc, activeListings)
  }
  var then = Math.floor(new Date(body.since).getTime() / 1000)
  activeListings = db.since(then, activeListings)
  res.render('listings', { title: 'Express', listings: db.toPublic(100, activeListings), success: "Yep, we got some :)" });
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
  var then = Math.floor(new Date(body.since).getTime() / 1000)
  listings = db.since(then, listings)
  res.render('listings', { title: 'Express', listings: db.toPublic(100, listings), success: "Yep, we got some :)" });
});

var smaz = require("smaz")
/* Add one listing. */
const Joi = require('joi');


var giveObj = require('../helper_ops').give
var giveOp = require('../helper_ops').ops
router.post('/add', global.passwordless.restricted({ failureRedirect: '/login' }), giveObj.upload.single('avatar'), async (req, res, next) => {
  const { body } = req;
  const listingSchema = Joi.object().keys({
    title: Joi.string().regex(/^\W*\w+(?:\W+\w+)*\W*$/).min(10).max(100).required(),
    desc: Joi.string().min(10).max(5000).required(),
    tags: Joi.array().items(Joi.string().min(3).max(20)).required(),
    lat: Joi.number().max(90).min(-90).optional(),
    lng: Joi.number().max(180).min(-180).optional(),

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
    // body.desc = sanitizeHtml(body.desc)
    var betterDescription = giveOp.cleanSensitive(giveOp.sanitize(body.desc))
    body.desc = Array.from(smaz.compress(betterDescription))
    var entry = _.extend(body, { id: now, pass: password, d: 0, a: 0, img: req.file.filename })
    var err = db.push(entry)
    // TODO: not here, in a cron job
    db.persist()
    if (!err) {
      giveOp.mail(`<a href="https://dzlistings.com/listings/${pass2}/${entry.id}">check</a><br><br><hr><a href="https://dzlistings.com/listings/${pass}/${entry.id}">approve</a> `)
      res.render('listing', { title: 'One listing', data: entry, success: "Success. Here is the password whenever you want to deactivate the listing :)" })
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
    var elem = db.get({ pass: body.password })
    db.deactivate(elem.id)
    res.render('messages', { title: 'Express', message: 'Item deactivated', success: "Listing has been successfully deactivated. Users will not see it again :)" });
  }
});

let pass = process.env.PASS
let pass2 = process.env.PASS2

/* GET one listing; must not be unnapproved yet. */
router.get(`/${pass2}/:id`, function (req, res, next) {
  var id = parseInt(req.params.id)
  var elem = db.get({ id: id, d: 0, a: 0 })
  if (_.isEmpty(elem))
    res.render('listing', { title: 'Express', data: elem, error: "No listing found, it can be deactivated or not approved yet :(" });
  else
    res.render('listing', { title: 'Express', data: elem, success: "Yep :)" });
});


/* Approve one listing. */
router.get(`/${pass}/:id`, function (req, res, next) {
  var id = parseInt(req.params.id)
  var elem = db.get({ id: id, a: 0 })

  if (_.isEmpty(elem))
    res.render('messages', { title: 'Express', message: 'Item approval', error: "Listing not found or already approved" });
  var success = db.approve(elem.id)
  if (success) {
    res.render('messages', { title: 'Express', message: 'Item approval', success: "Listing has been successfully approved :)" });
  }
});


module.exports = router;
