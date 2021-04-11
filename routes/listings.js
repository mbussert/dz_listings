var express = require('express');
var router = express.Router();
var db = require('../helper').db
var _ = require('underscore');

// { "id": 0, "d": 0, "title": 3, "desc": "dqs878dsq" }
/* GET listings not including deactivated. */
router.get('/', function (req, res, next) {
  var pubListings = db.toPublic(100)
  res.render('listings', { title: 'Express', listings: pubListings });
});

/* GET one listing; must be deactivated. */
router.get('/:id', function (req, res, next) {
  var id = parseInt(req.params.id)
  res.render('listing', { title: 'Express', data: db.get({ id: id, d: 0 }) });
});

/* Query listings not including deactivated. */
router.post('/query', async (req, res, next) => {
  const { body } = req;
  var activeListings = db.toPublic()
  const querySchema = Joi.object().keys({
    title: Joi.string().alphanum().min(3).max(100),
    exactTitle: Joi.boolean().truthy('on').falsy('off').default(false),
    desc: Joi.string().min(10).max(500),
    exactDesc: Joi.boolean().truthy('on').falsy('off').default(false),
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
      activeListings = db.fetch({ desc: body.desc }, activeListings)
    else
      activeListings = db.fetchDeep('desc', body.desc, activeListings)
  }

  res.render('listings', { title: 'Express', listings: db.toPublic(100, activeListings) });
});

/* Add one listing. */
const Joi = require('joi');
router.post('/add', async (req, res, next) => {
  const { body } = req;
  const listingSchema = Joi.object().keys({
    title: Joi.string().alphanum().min(10).max(100).required(),
    desc: Joi.string().min(10).max(500).required(),
  });
  const result = listingSchema.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {
    var password = (Math.random().toString(36).substr(4)).slice(0, 9)
    var now = Math.floor(new Date().getTime() / 1000)
    var entry = _.extend(body, { id: now, pass: password, d: 0 })
    var err = db.push(entry)
    // TODO: not here, in a cron job
    db.persist()
    if (!err)
      res.render('listing', { title: 'One listing', data: entry })
    else
      // if error
      res.status(500).json({
        message: 'Internal error: mapping posted object in /add',
        data: entry,
        error: err
      })
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
    res.render('messages', { title: 'Express', message: 'Item deactivated' });
  }
});


module.exports = router;
