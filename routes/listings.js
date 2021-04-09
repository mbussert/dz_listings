var express = require('express');
var router = express.Router();
var db = require('../helper').db
var _ = require('underscore');

// { "id": 0, "d": 0, "title": 3, "desc": "dqs878dsq" }
/* GET users listing. */
router.get('/', function (req, res, next) {
  console.log(global.listings)
  res.render('listings', { title: 'Express', listings: global.listings });
});

const Joi = require('joi');
router.post('/add', async (req, res, next) => {
  const { body } = req;
  const blogSchema = Joi.object().keys({
    title: Joi.string().alphanum().min(10).max(100).required(),
    desc: Joi.string().min(10).max(500).required(),
  });
  const result = blogSchema.validate(body);
  const { value, error } = result;
  const valid = error == null;
  if (!valid) {
    res.status(422).json({
      message: 'Invalid request',
      data: body,
      error: error
    })
  } else {
    var now = Math.floor(new Date().getTime() / 1000)
    var entry = _.extend(body, { id: now })
    var err = db.push(entry)
    db.persist()
    if (!err)
      res.json({ message: 'Resource created', data: entry })
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
  res.render('listings', { title: 'Express', message: 'Item deactivated' });
});

module.exports = router;
