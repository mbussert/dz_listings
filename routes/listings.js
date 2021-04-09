var express = require('express');
var router = express.Router();
var bigVar = global.listings

/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('listings', { title: 'Express', listings: bigVar });
});

const Joi = require('joi');
router.post('/add', async (req, res, next) => { 
  const { body } = req;
  const blogSchema = Joi.object().keys({ 
    title: Joi.string().required(),
    description: Joi.string().required(), 
    authorId: Joi.number().required() 
  }); 
  const result = blogSchema.validate(body); 
  const { value, error } = result; 
  const valid = error == null; 
  if (!valid) { 
    res.status(422).json({ 
      message: 'Invalid request', 
      data: body 
    }) 
  } else { 
    // const createdPost = await api.createPost(body); 
    res.json({ message: 'Resource created', data: data }) 
  } 
});

router.get('/deactivate', function (req, res, next) {
  res.render('listings', { title: 'Express', message: 'Item deactivated' });
});

module.exports = router;
