var express = require('express');
var router = express.Router();
var db = require('../helper_data').db
var messages = require('../messages').messages

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', user: req.session.user, listings: db.toPublic(100, global.listings) });
});

// Blog pages are pages with little server processing
router.get('/blog', function (req, res, next) {
  res.render('blog', {
    title: 'Listings', user: req.session.user, sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/about', function (req, res, next) {
  res.render('blog', {
    title: 'What is listings', user: req.session.user, sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/howto', function (req, res, next) {
  res.render('blog', {
    title: 'How to post on Listings', user: req.session.user, sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/contact', function (req, res, next) {
  res.render('blog', {
    title: 'Contact us', user: req.session.user, sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/policy', function (req, res, next) {
  res.render('blog', {
    title: 'Terms of usage', user: req.session.user, sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

var freemail = require('freemail');
router.get('/login', function (req, res) {
  var errors = req.flash('passwordless'), errHtml;
  for (var i = errors.length - 1; i >= 0; i--) {
    errHtml += '<p>' + errors[i] + '</p>';
  }
  console.log(errHtml)
  res.render('login');
});

router.post(
  "/sendtoken",
  // urlencodedParser,
  global.passwordless.requestToken(
    // Simply accept every user*
    function (user, delivery, callback) {
      console.log(user)
      if (freemail.isFree(user))
        callback(null, user);
      else
        callback(null, null)
    }
    , { failureRedirect: '/login', failureFlash: 'This user is unknown!' }),
  function (req, res) {
    console.log(req.user)
    res.send('Check your email. You will be able to login from there.');
  }
);

router.get('/logged_in', global.passwordless.acceptToken(),
  function (req, res) {
    req.session.user = req.user;
    res.render('messages', { title: 'Express', message: 'User login', success: "User has been successfully logged in :)" });
  });

module.exports = router;
