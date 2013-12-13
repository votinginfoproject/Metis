/**
 * Created by Akelaus on 12/4/13.
 */

//app configuration
var config = require('./../config');

//database setup
var mongoose = require('mongoose');
var daoSchemas = require('./schemas');

mongoose.connect(config.mongoose.connectionString);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("Initializing Mongoose...")
  daoSchemas.initSchemas(config, mongoose);
  console.log("Initialized Mongoose for VIP database.");
});

/*
 * TODO: Move these functions to a separate file
 */
var getFeedList = function(callback) {
  daoSchemas.models.Feed.find({}, { payload: 0 }, callback);
};

var getFeedOverview = function(id, callback) {
  daoSchemas.models.Feed.findById(id, { payload: 0 }, callback);
};

exports.getFeeds = getFeedList;
exports.getFeedOverview = getFeedOverview;


