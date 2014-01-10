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
function getFeedList (callback) {
  daoSchemas.models.Feed.find({}, { payload: 0 })
    .populate('_state')
    .populate('_election', 'electionType date')
    .exec(callback);
};

function getFeedOverview (id, callback) {
  daoSchemas.models.Feed.findById(id, { payload: 0 }, callback);
};

function getFeedSource (feedId, callback) {
  daoSchemas.models.Source.findOne({ _feed: feedId }).populate('_feedContact').exec(callback);
};

function getFeedElection (feedId, callback) {
  var election;
  var promise = daoSchemas.models.Election.findOne({ _feed: feedId }).populate('_state').exec();

  promise.then(function(elec) {
    election = elec;
    return daoSchemas.models.Locality.count({ _feed: feedId }).exec();
  }).then(function(localityCount) {
    election._state.localityCount = localityCount;
    callback(undefined, election);
  });
};

function getElectionOfficial (feedId, officialId, callback) {
  daoSchemas.models.ElectionOfficial.findOne( { _feed: feedId, elementId: officialId }, callback);
};

function getFeedContests (feedId, callback) {
  daoSchemas.models.Contest.find( { _feed: feedId}, callback);
};

function getState (feedId, callback) {
  daoSchemas.models.State.findOne({ _feed: feedId })
    .populate('_electionAdministration')
    .populate('_localities')
    .exec(callback);
};

function getStateEarlyVoteSites (feedId, callback) {
  daoSchemas.models.EarlyVoteSite.find({ _feed: feedId }, callback);
};

function getLocalities (feedId, callback) {
  daoSchemas.models.Locality.find({ _feed: feedId }, callback);
};

function getLocality (feedId, localityId, callback) {
  daoSchemas.models.Locality.findOne({ _feed: feedId, elementId: localityId })
    .populate('_electionAdministration')
    .exec(callback);
};

function getLocalityEarlyVoteSite (feedId, localityId, callback) {
  var promise = daoSchemas.models.EarlyVoteSite.find({ _feed: feedId })
    .populate('_locality')
    .exec();

  promise.then(function (earlyVoteSites) {
    var evs = earlyVoteSites.filter(function(site) {
      return site._locality && site._locality.elementId == localityId;
    });
    callback(undefined, evs);
  });
};

function getLocalityPrecincts (feedId, localityId, callback) {
  daoSchemas.models.Precinct.find({ _feed: feedId, localityId: localityId }, callback);
};

function getLocalityPrecinct (feedId, precinctId, callback) {
  daoSchemas.models.Precinct.findOne({ _feed: feedId, elementId: precinctId }, callback);
};

function getLocalityPrecinctEarlyVoteSites (feedId, precinctId, callback) {
  var promise = daoSchemas.models.Precinct.findOne({ _feed: feedId, elementId: precinctId })
    .select('_earlyVoteSites')
    .exec();

  promise.then(function (evs) {
    if (evs) {
      daoSchemas.models.EarlyVoteSite.find({ _id: { $in: evs._earlyVoteSites } }, callback);
    }
  })
};

exports.getFeeds = getFeedList;
exports.getFeedOverview = getFeedOverview;
exports.getFeedSource = getFeedSource;
exports.getFeedElection = getFeedElection;
exports.getElectionOfficial = getElectionOfficial;
exports.getFeedContests = getFeedContests;
exports.getState = getState;
exports.getStateEarlyVoteSites = getStateEarlyVoteSites;
exports.getLocalities = getLocalities;
exports.getLocality = getLocality;
exports.getLocalityEarlyVoteSite = getLocalityEarlyVoteSite;
exports.getLocalityPrecincts = getLocalityPrecincts;
exports.getLocalityPrecinct = getLocalityPrecinct;
exports.getLocalityPrecinctEarlyVoteSites = getLocalityPrecinctEarlyVoteSites;
