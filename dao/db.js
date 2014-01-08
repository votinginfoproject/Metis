/**
 * Created by Akelaus on 12/4/13.
 */

//app configuration
var config = require('../config');

//database setup
var mongoose = require('mongoose');
var daoSchemas = require('./schemas');
var mockingVars = require('../public/test/Mocking');

mockingVars.setupProxyE2E();

mongoose.connect(config.mongoose.connectionString);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error: '));
db.once('open', function callback(){
  console.log("Initializing Mongoose...")
  daoSchemas.initSchemas(mongoose);
  console.log("Initialized Mongoose for VIP database.");
});

/*
 * TODO: Move these functions to a separate file
 */
var getFeedList = function(callback) {
  daoSchemas.models.Feed.find({}, { payload: 0 })
    .populate('_state')
    .populate('_election', 'electionType date')
    .exec(callback);
};

var getFeedOverview = function(id, callback) {
  daoSchemas.models.Feed.findById(id, { payload: 0 }, callback);
};

var getFeedSource = function(feedid, callback) {
  daoSchemas.models.Source.findOne({ _feed: feedid }).populate('_feedContact').exec(callback);
};

var getFeedElection = function(feedid, callback) {
  var election;
  var promise = daoSchemas.models.Election.findOne({ _feed: feedid }).populate('_state').exec();

  promise.then(function(elec) {
    election = elec;
    return daoSchemas.models.Locality.count({ _feed: feedid }).exec();
  }).then(function(localityCount) {
    election._state.localityCount = localityCount;
    callback(undefined, election);
  });
};

var getElectionOfficial = function(feedid, officialId, callback) {
  daoSchemas.models.ElectionOfficial.findOne( { _feed: feedid, elementId: officialId }, callback);
};

var getFeedContests = function(feedid, callback) {
  daoSchemas.models.Contest.find( { _feed: feedid}, callback);
};

function getState(feedid, callback) {
  daoSchemas.models.State.findOne({ _feed: feedid })
    .populate('_electionAdministration')
    .populate('_localities')
    .exec(callback);
};

function getStateEarlyVoteSites(feedid, callback) {
  daoSchemas.models.EarlyVoteSite.find({ _feed: feedid }, callback);
};

exports.getFeeds = getFeedList;
exports.getFeedOverview = getFeedOverview;
exports.getFeedSource = getFeedSource;
exports.getFeedElection = getFeedElection;
exports.getElectionOfficial = getElectionOfficial;
exports.getFeedContests = getFeedContests;
exports.getState = getState;
exports.getStateEarlyVoteSites = getStateEarlyVoteSites;
