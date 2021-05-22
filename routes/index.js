const express = require('express');
const router = express.Router();
const db = require('../helper_data').db;
const messages = require('../messages').messages;
// messages.Artworks.en
/* GET home page. */
router.get('/', function(req, res, next) {
  if (!global.pubView || !global.pubView.length) {
    db.setView();
  }
  res.render('index', {
    title: 'Express',
    user: req.session.user,
    listings: global.pubView,
  });
});

router.get('/tag/:tag', function(req, res, next) {
  const tag = req.params.tag;
  let listings = db.toPublic();
  listings = db.fetchByTag(tag, listings);
  res.render('index', {
    title: tag,
    user: req.session.user,
    listings: listings,
  });
});

// Blog pages are pages with little server processing
router.get('/categories', function(req, res, next) {
  res.render('blogs', {
    title: 'Categories', user: req.session.user, sections: [
      {id: 'Donations', html: req.t('Donations')},
      {id: 'Artworks', html: req.t('Artworks')},
      {id: 'Blogs', html: req.t('Blogs')},
    ],
  });
});

router.get('/about', function(req, res, next) {
  res.render('blogs', {
    title: 'What is DZ Listings', user: req.session.user, sections: [
      {id: 'What is', html: req.t('What is')},
      {id: 'Careful', html: req.t('What is, careful')},
    ],
  });
});

router.get('/howto', function(req, res, next) {
  res.render('blogs', {
    title: 'How to post on Listings', user: req.session.user, sections: [
      {id: 'Careful', html: req.t('Careful')},
      {id: 'Login', html: req.t('Login')},
      {id: 'Validation', html: req.t('Validation')},
    ],
  });
});

router.get('/policy', function(req, res, next) {
  res.render('blogs', {
    title: 'Terms of usage', user: req.session.user, sections: [
      {id: 'sec1', html: 'bob'},
      {id: 'sec2', html: 'Chota is <em>dead</em> simple to use. It doesn\'t require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the'},
      {id: 'sec3', html: 'Chota is <em>dead</em> simple to use. It doesn\'t require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the'.toUpperCase()},
    ],
  });
});


const freemail = require('freemail');
router.get('/login', function(req, res) {
  if (process.env.NODE_ENV === 'dev') {
    res.render('error', {
      message: 'only accessible in prod',
      error: 'only accessible in prod',
    });
  }
  const errors = req.flash('passwordless');
  let errHtml = '';
  for (let i = errors.length - 1; i >= 0; i--) {
    errHtml += errors[i];
  }
  res.render('login', {error: errHtml});
});

router.post(
    '/sendtoken',
    // urlencodedParser,
    global.passwordless.requestToken(
    // Simply accept every user*
        function(user, delivery, callback) {
          console.log(user);
          if (freemail.isFree(user)) {
            callback(null, user);
          } else {
            callback(null, null);
          }
        }
        , {failureRedirect: '/login', failureFlash: 'This user is unknown!'}),
    function(req, res) {
      console.log(req.user);
      res.send('Check your email. You will be able to login from there.');
    },
);

router.get('/logged_in', global.passwordless.acceptToken(),
    function(req, res) {
      req.session.user = req.user;
      res.render('messages', {
        title: 'Express',
        message: 'User login',
        success: 'User has been successfully logged in :)',
      });
    });

module.exports = router;
