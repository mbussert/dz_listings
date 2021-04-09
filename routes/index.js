var express = require('express');

var router = express.Router();
const redis = require('redis')

const redisPort = process.env.REDIS_PORT
// const client = (process.env.NODE_ENV === 'dev') ? redis.createClient(redisPort) : redis.createClient(process.env.REDISCLOUD_URL, { no_ready_check: true })
const client = redis.createClient(redisPort)
client.hmset("employees", { HR: "Anthony", MIS: " Clint", Accounting: "Mark" });

client.on('error', (error) => {
  console.error(error)
})


/* GET home page. */
router.get('/', function (req, res, next) {
  client.hgetall("employees", function (err, object) {
    console.log(object);
    res.render('index', { title: 'Express', listings: object});
  });
});

module.exports = router;
