# Barhopping
This is a freecodecamp fullstack project. Detailed requirements see:https://www.freecodecamp.org/challenges/build-a-nightlife-coordination-app

The boilerplate of this app was based on Express in Action book "Know about me" app (basically it handles authentication) and REST API implementation idea from Getting MEAN with Mongo, Express, Angular and Node by Simon Holmes.

This implemented all the user stories and more. This can be further improved:

1) experiment with different APIs from yelp (currently only use their businesses api) to enrich functionality
2) better error handling - only run on chrome and safari, without extensive testing
3) add msg and notification (send to friends about user's plans)
4) login with social medias 
5) Mobile enable (d3 charts dont seem to appear using iphone)

Then this will be a useful app. For now, just an exercise for learning.

Heroku deployment notes: 

- Mongodb based on mLab's free tier sandbox
- Followed instructions in https://forum.freecodecamp.org/t/guide-for-using-mongodb-and-deploying-to-heroku/19347
- in mongoose.connect(url), changed to mongoose.connect(url, {useMongoClient:true}) option. It receives WARNING: The `useMongoClient` option is no longer necessary in mongoose 5.x, please remove it.
- But without it, it does not pass mongodb authentication 

