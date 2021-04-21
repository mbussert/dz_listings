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

#### Routes 
Routes reflect what is possible. See https://github.com/bacloud14/dz_listings/blob/main/routes/listings.js 
Otherwise, this is the list of routes (queries and views):

  - localhost:3000/listings -> listings.ejs : is for showing some of items. Also to initiate the following post queries
  - localhost:3000/listings/query -> listings.ejs : for exact search of items
  - localhost:3000/listings/queryV2 -> listings.ejs : for fuzzy search items
  - localhost:3000/listings/add -> listing.ejs : for adding an item
  - localhost:3000/listings/deactivate -> messages.ejs : to deactivate an item
  - localhost:3000/listings/{some_id} -> listing.ejs : to show an item --> 
  - localhost:3000/listings/tags -> tags.ejs : for exposing contant list of possible tags
  - localhost:3000/ exposts all other routes (contact, tags, listings, ...)

  you can tell everything necessary is under /listings/ route so why not attach all to index (/) ? Yes, probably, for now I think it's OK but if fewer than expected routes are added, we move listings routes to index. 


### Contribution
As always, all my repositories are firstcomers friendly ! 

As I am always learning, please do not hesitate to open any new issue (like better code, readability, modularity and best practice, performance, better UI or even functionality enhancements...).


