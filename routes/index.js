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
      { id: "what_is", html: "Listings is here to let anyone post on the internet, but seriously. Like newspapers and magazines, Listings has these two main sections: announcements and donnations." },
      { id: "careful", html: "Listings does not want to replace any other paper or digital platform. It does not want 'any' business deals too. All listings 'must' be free. Please read the 'policy' page before posting." },
    ]
  });
});

router.get('/howto', function (req, res, next) {
  res.render('blog', {
    title: 'How to post on Listings', user: req.session.user, sections: [
      { id: "careful", html: "Before enjoying Listings, You must accept user policy before posting. You should behave in civic manners so no room for racism or hate. We have the right to ban a user permanently or an IP temporarly." },
      { id: "listing", html: "Because we value privacy, Listings needs only your Email before posting or messaging another user. A listing has a title, text content, geolocation, tags and one single image." },
      { id: "validation", html: "Before you can see your post, an Administrator needs to validate its content and then it becomes visible to other users. We have the right to delete a listings before or after it is publically visible."}
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
  var errors = req.flash('passwordless'), errHtml = '';
  for (var i = errors.length - 1; i >= 0; i--) {
    errHtml += errors[i];
  }
  res.render('login', { error: errHtml });
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
