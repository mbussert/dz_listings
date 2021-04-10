var express = require('express');
var router = express.Router();
var db = require('../helper').db
var _ = require('underscore');

// { "id": 0, "d": 0, "title": 3, "desc": "dqs878dsq" }
/* GET users listing. */
router.get('/', function (req, res, next) {
  // without password 
  var pubListings = _.map(global.listings, entrie => { return _.pick(entrie, 'id', 'title', 'desc')})
  res.render('listings', { title: 'Express', listings: pubListings });
});

const Joi = require('joi');
router.post('/add', async (req, res, next) => {
  const { body } = req;
  const listing = Joi.object().keys({
    title: Joi.string().alphanum().min(10).max(100).required(),
    desc: Joi.string().min(10).max(500).required(),
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
    var password = (Math.random().toString(36).substr(4)).slice(0,9)
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

router.get('/deactivate', function (req, res, next) {
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
    db.get(global.listings, {pass: body})
    // res.render('listings', { title: 'Express', message: 'Item deactivated' });
  }
  
});

module.exports = router;
