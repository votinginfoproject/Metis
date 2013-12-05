/**
 * Created by Akelaus on 12/4/13.
 */

//app configuration
var config = require('./config');

var moment = require('moment');

//database setup
var mongoose = require('mongoose');
mongoose.connect(config.mongoose.connectionString);

/*
 * Schemas
 */
var FeedSchema;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("initialized VIP database via Mongoose");
  FeedSchema = mongoose.Schema({
    //payload: Buffer,
    election_date: Date,
    loaded_on: Date,
    validation_status: Boolean,
    feed_status: String,
    feed_type: String,
    name: String,  //edit for JSON
    state: String,  //will eventually be a VIP ID (TODO: consider for sprint 2)
    date: Date,
    election_id: String,
    vip_id: String
  });
});

var retrieve_feeds = function(callback) {
  mongoose.model(config.mongoose.model.feed, FeedSchema);
  var Feed = mongoose.model(config.mongoose.model.feed);

  Feed.find({},{payload: 0}, callback);
};

var map_feed = function(feed) {
  return {
    date: moment(feed.election_date).format('YYYY-MM-DD'),
    state: feed.state,
    type: feed.feed_type,
    status: feed.feed_status,
    name: feed.name,
    edit: '/services/feeds/' + feed.name
  };
};

exports.getFeeds = retrieve_feeds;
exports.mapFeeds = map_feed;

