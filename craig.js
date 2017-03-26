var FeedParser = require('feedparser');
var request = require('request'); // for fetching the feed

var req = request('https://lakeland.craigslist.org/search/sss?query=tv&zoomToPosting=&minAsk=&maxAsk=&format=rss')
var feedparser = new FeedParser();

req.on('error', function (error) {
  // handle any request errors
});

req.on('response', function (res) {
  var stream = this; // `this` is `req`, which is a stream

  if (res.statusCode !== 200) {
    this.emit('error', new Error('Bad status code'));
  }
  else {
    stream.pipe(feedparser);
  }
});

feedparser.on('error', function (error) {
  // always handle errors
});

feedparser.on('readable', function () {
  // This is where the action is!
  console.log("RSS Found! Now parsing...")
  var stream = this; // `this` is `feedparser`, which is a stream
  var meta = this.meta; // **NOTE** the "meta" is always available in the context of the feedparser instance
  var item;
  var items = []
  while (item = stream.read()) {
    items.push(item);
  }
  console.log("List Generated...")
  console.log(items[0].title);

});
