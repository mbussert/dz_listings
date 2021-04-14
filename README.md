# Listings

When you don't care too much about normalization, also when you are tired of databases and different driver implementations with their tedious considerations.

You did not ask for all of these, you just wanted to store some megabytes in a file and at the same time query plain JavaScript objects in realtime.

You did not ask for clustering or paralelization neither.

Then, only then, you can always use a data-structures and a JSON file.

### Considerations:
- NodeJS is a single thread program. That means multiple function calls on one global variable (multiple user connections) will definitly not mess things up.
- Watch on the global variable size though, as it lives in memory.

That's it. See how I want to build an listing (announcements, item re-sell...) web app.

Also without authentication, (must re-enforce visibility of new added listings after validation by an admin though.).

Take a look as a starting point here:

[helpers simple API](https://github.com/bacloud14/dz_listings/blob/main/helper.js)

### Contribution
As always, all my repositories are firstcomers friendly ! 

As I am always learning, please do not hesitate to open any new issue (like better code, readability, modularity and best practice, performance, better UI or even functionality enhancements...).


