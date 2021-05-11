const express = require('express');
const router = express.Router();
const db = require('../helper_data').db;
// const messages = require('../messages').messages;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', {
    title: 'Express',
    user: req.session.user,
    listings: db.toPublic(100, '', global.listings),
  });
});

// Blog pages are pages with little server processing
router.get('/categories', function(req, res, next) {
  res.render('blog', {
    title: 'Categories', user: req.session.user, sections: [
      {id: 'Donations', html: '<blockquote>A donation is a gift for charity, humanitarian aid, or to benefit a cause. A donation may take various forms, including money, alms, services, or goods such as clothing, toys, food, or vehicles. A donation may satisfy medical needs such as blood or organs for transplant. [Wikipedia] </blockquote>  <p>However in Listings, you can only donate <em>used</em> items. That means <b>you cannot sell</b> or ask for exchange. <b>Business deals are prohibited</b> in Listings. To be able to post in this category, please see <a href=\'/listings/tags\'>tags page</a>. From there you must wisely select one tag from the third column or from the second column if you don\'t find a suitable tag.<p>'},
      {id: 'Artworks', html: 'You can share for <em>your</em> website or digital assets (things you own or worked on). Please do not advocate for <em>other work</em> and do not ask for support or any business deals.'},
      {id: 'Blogs', html: 'In this section, you can share posts <em>you</em> published online. You can also share your passions with other people.'},
    ],
  });
});

router.get('/about', function(req, res, next) {
  res.render('blog', {
    title: 'What is listings', user: req.session.user, sections: [
      {id: 'What is', html: 'Listings is here to let anyone post on the internet, but <em>seriously</em> and for <em>free</em>. Like newspapers and magazines, Listings has these two main sections: <b>announcements and donnations.</b>'},
      {id: 'Careful', html: 'Listings does not want to replace any other paper or digital platform. It does not want \'any\' business deals using its platform. All listings \'must\' be free. Please read the \'policy\' page before posting.'},
    ],
  });
});

router.get('/howto', function(req, res, next) {
  res.render('blog', {
    title: 'How to post on Listings', user: req.session.user, sections: [
      {id: 'Careful', html: 'Before enjoying Listings, You must accept user policy before posting. You should behave in civic manners so no room for racism or hate. We have the right to ban a user permanently or an IP temporarly.'},
      {id: 'Listing', html: 'Because we value privacy, Listings needs only your Email before posting or messaging another user. A listing has a title, text content, geolocation, tags and one single image.'},
      {id: 'Validation', html: 'Before you can see your post, an Administrator needs to validate its content and then it becomes visible to other users. We have the right to delete a listings before or after it is publically visible.'},
    ],
  });
});

router.get('/contact', function(req, res, next) {
  res.render('blog', {
    title: 'Contact us', user: req.session.user, sections: [
      {id: 'sec1', html: 'bob'},
      {id: 'sec2', html: 'Chota is <em>dead</em> simple to use. It doesn\'t require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the'},
      {id: 'sec3', html: 'Chota is <em>dead</em> simple to use. It doesn\'t require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the'.toUpperCase()},
    ],
  });
});

router.get('/policy', function(req, res, next) {
  res.render('blog', {
    title: 'Terms of usage', user: req.session.user, sections: [
      {id: 'sec1', html: 'bob'},
      {id: 'sec2', html: 'Chota is <em>dead</em> simple to use. It doesn\'t require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the'},
      {id: 'sec3', html: 'Chota is <em>dead</em> simple to use. It doesn\'t require learning a lot of class names like other frameworks. It applies a few basic styles to the HTML following the'.toUpperCase()},
    ],
  });
});

const freemail = require('freemail');
router.get('/login', function(req, res) {
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
