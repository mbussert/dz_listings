var express = require('express');
var router = express.Router();
var bigVar = global.listings

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', listings: bigVar });
});

router.get('/blog', function (req, res, next) {
  res.render('blog', {
    title: 'Express', sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/login', function (req, res) {
  res.render('login');
});

router.post(
  "/sendtoken",
  // urlencodedParser,
  global.passwordless.requestToken(
    // Simply accept every user*
    function (user, delivery, callback) {
      callback(null, user);
    }
  ),
  function (req, res) {
    res.render('messages');
  }
);

module.exports = router;
