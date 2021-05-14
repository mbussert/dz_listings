/* eslint max-len: ["error", { "code": 1000 }]*/
// Click on Alt-Z or View/Toggle.. to toggle word wrap
// Until 1000 seems fine,
// Do not exceed 1000 length for each message as a rule for the whole project!
// Should not serialize or persist as JSON.

const messages = {
  'Donations':
    {
      'ar': '',
      'en': '<blockquote>A donation is a gift for charity, humanitarian aid, or to benefit a cause. A donation may take various forms, including money, alms, services, or goods such as clothing, toys, food, or vehicles. A donation may satisfy medical needs such as blood or organs for transplant. [Wikipedia] </blockquote>  <p>However in Listings, you can only donate <em>used</em> items. That means <b>you cannot sell</b> or ask for exchange. <b>Business deals are prohibited</b> in Listings. To be able to post in this category, please see <a href=\'/listings/tags\'>tags page</a>. From there you must wisely select one tag from the third column or from the second column if you don\'t find a suitable tag. Although this site is a facilitator for donations without any business deals, You must obey <a href="https://www.commerce.gov.dz/ar/code-du-commerce#"> Algerian Commercial Laws </a> in regards of possessing and giving legal items as we take no further responsibility.<p>',
      'fr': '',
    },
  'Artworks':
    {
      'ar': '',
      'en': '<blockquote>The pieces of art, such as drawings and photographs, that are used in books, newspapers, and magazines. [Cambridge English Dictionary] </blockquote>You can share for <em>your</em> website or digital assets (things you own or worked on). Please do not advocate for <em>other work</em> and do not ask for support or any business deals.',
      'fr': '',
    },
  'Blogs':
    {
      'ar': '',
      'en': 'In this section, you can share posts <em>you</em> published online. You can also share your passions, hobbies and passtimes with other people.',
      'fr': '',
    },
  'policy':
    {
      'ar': '',
      'en': '',
      'fr': '',
    },
  'Careful':
    {
      'ar': '',
      'en': 'Before enjoying Listings, You must accept user policy. You should behave in civic manners so no room for racism or hate. We have the right to ban a user\'s email permanently or an IP temporarly.',
      'fr': '',
    },
  'Login':
    {
      'ar': '',
      'en': 'Because we value privacy, Listings needs only your Email before posting or messaging another user. A listing has a title, text content, geolocation, tags and one single image.',
      'fr': '',
    },
  'Validation':
    {
      'ar': '',
      'en': 'Before you can see your post, an Administrator needs to validate its content, later it becomes visible. We have the right to delete a listings before or after it is published.',
      'fr': '',
    },
  //   about
  'What is':
    {
      'ar': '',
      'en': 'Listings is here to let anyone post on the internet, but <em>seriously</em> and for <em>free</em>. Like newspapers and magazines, Listings has these three main sections: <b>Donnations, Artworks and Blog posts.</b>',
      'fr': '',
    },
  'What is, careful':
    {
      'ar': '',
      'en': 'Listings does not want to replace any other paper or digital platform. It does not want \'any\' business deals on its platform. All listings \'must\' be free. Please read the \'policy\' page before posting.',
      'fr': '',
    },
  'Mail':
    {
      'ar': '',
      'en': (pass, pass2, id) => `<a href="https://dzlistings.com/listings/${pass2}/${id}">check</a><br><br><hr><a href="https://dzlistings.com/listings/${pass}/${id}">approve</a> `,
      'fr': '',
    },
};

module.exports.messages = messages;
