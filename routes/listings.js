var express = require('express');
var router = express.Router();

const client = redis.createClient(redisPort)

client.on('error', (error) => {
  console.error(error)
})

/* GET users listing. */
router.get('/', function (req, res, next) {
  client.hgetall("employees", function (err, object) {
    console.log(object);
  });
  res.render('listings', { title: 'Express', listings: object });
});

router.get('/add', function (req, res, next) {
  res.render('listings', { title: 'Express', message: 'Item added' });
});

router.get('/deactivate', function (req, res, next) {
  res.render('listings', { title: 'Express', message: 'Item deactivated' });
});

module.exports = router;
