var express = require('express');
var router = express.Router();
var bigVar = global.listings

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express', listings: bigVar });
});

// Blog pages are pages with little server processing
router.get('/blog', function (req, res, next) {
  res.render('blog', {
    title: 'Listings', sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/about', function (req, res, next) {
  res.render('blog', {
    title: 'What is listings', sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/howto', function (req, res, next) {
  res.render('blog', {
    title: 'How to post on Listings', sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/contact', function (req, res, next) {
  res.render('blog', {
    title: 'Contact us', sections: [
      { id: "sec1", html: "bob" },
      { id: "sec2", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the" },
      { id: "sec3", html: "Chota is <em>dead</em> simple to use. It doesn't require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the".toUpperCase() },
    ]
  });
});

router.get('/policy', function (req, res, next) {
  res.render('blog', {
    title: 'Terms of usage', sections: [
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
      console.log(user)
      callback(null, user);
    }
  ),
  function (req, res) {
    console.log(req.user)
		res.send('Check your email. You will be able to login from there.');
  }
);

router.get('/logged_in', global.passwordless.acceptToken(), 
	function(req, res) {
    console.log(req.user)
		res.render('messages', { title: 'Express', message: 'User login', success: "User has been successfully logged in :)" });
});

module.exports = router;
