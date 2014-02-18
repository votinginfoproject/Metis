/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var async = require('async');
var when = require('when');

var contests = require('./contests');
var results = require('./results');
var contest = require('./contest');
var locality = require('./locality');
var pollinglocations = require('./pollinglocations');

var overviewModels = [];

mongoose.connect(config.mongoose.connectionString);
console.log("initialized VIP database via Mongoose");
schemas.initSchemas(mongoose);
schemas.models.Feed.find({})
  .exec(function(err, feeds) {

  calculateFields(feeds[0]._id, function() {
    var createOverviews = [];

    console.log('Saving models');
    overviewModels.forEach(function(overview) {
      createOverviews.push(schemas.models.Overview.create(overview));
    });

    when.all(createOverviews).then(onSaveComplete, errorHandler);
  });
});
function errorHandler(err) {
  console.error(err);
}

function onSaveComplete(results) {
  mongoose.disconnect();
  process.exit();
}

function calculateFields(feedId, saveCalc) {
  var calcCount = 0;
  function wait() {
    if(++calcCount === 5)
      saveCalc();
  }

  console.log('Starting PollingLocations Calc...');
  pollinglocations.pollingLocationsCalc(feedId, function(pollinglocationsOverview) {
    console.log('Finished PollingLocations');
    createOverviewModel('Early Vote Sites', pollinglocationsOverview.earlyvotesites, -1, 1, feedId);
    createOverviewModel('Election Administrations', pollinglocationsOverview.electionadministrations, -1, 1, feedId);
    createOverviewModel('Localities', pollinglocationsOverview.localities, -1, 1, feedId);
    createOverviewModel('Polling Locations', pollinglocationsOverview.pollinglocations, -1, 1, feedId);
    createOverviewModel('Precincts', pollinglocationsOverview.precincts, -1, 1, feedId);
    createOverviewModel('Precinct Splits', pollinglocationsOverview.precinctsplits, -1, 1, feedId);
    createOverviewModel('Street Segments', pollinglocationsOverview.streetsegments, -1, 1, feedId);
    wait();
  });

  console.log('Starting Contests Calc...');
  contests.contestCalc(feedId, function(contestOverview) {
    console.log('Finished Contests');
    createOverviewModel('Ballots', contestOverview.ballots, -1, 1, feedId);
    createOverviewModel('Candidates', contestOverview.candidates, -1, 1, feedId);
    createOverviewModel('Contests', contestOverview.contests, -1, 1, feedId);
    createOverviewModel('Electoral Districts', contestOverview.electoralDistricts, -1, 1, feedId);
    createOverviewModel('Referenda', contestOverview.referenda, -1, 1, feedId);
    wait();
  });

  console.log('Starting Results Calc...');
  results.resultsCalc(feedId, function(resultsOverview) {
    console.log('Finished Results');
    createOverviewModel('Contest Results', resultsOverview.contestResults, -1, 2, feedId);
    createOverviewModel('Ballot Line Results', resultsOverview.ballotLineResults, -1, 2, feedId);
    wait();
  });

  console.log('Starting Single Contest Calc...');
  contest.contestCalc(feedId, function(contestOverview) {
    console.log('Finished Single Contest');
    contestOverview.forEach(function(overview) {
      createOverviewModel('Ballot', overview.ballot, -1, overview.section, feedId);
      createOverviewModel('Candidates', overview.candidate, -1, overview.section, feedId);
      createOverviewModel('Electoral District', overview.electoralDistrict, -1, overview.section, feedId);
      createOverviewModel('Referenda', overview.referenda, -1, overview.section, feedId);
    });
    wait();
  });

  console.log('Starting Single Locality Calc...');
  locality.localityCalc(feedId, function(localityOverview) {
    console.log('Finished Single Locality');
    localityOverview.forEach(function(overview) {
      createOverviewModel('Early Vote Sites', overview.earlyVoteSites, -1, overview.section, feedId);
      createOverviewModel('Election Administration', overview.electionAdmin, -1, overview.section, feedId);
      createOverviewModel('Precincts', overview.precincts, -1, overview.section, feedId);
      createOverviewModel('Precinct Splits', overview.precinctSplits, -1, overview.section, feedId);
      createOverviewModel('Polling Locations', overview.pollingLocations, -1, overview.section, feedId);
      createOverviewModel('Street Segments', overview.streetSegments, -1, overview.section, feedId);
    });
    wait();
  });
};

function createOverviewModel(name, overview, errors, section, feed) {
  overviewModels.push({
    elementType: name,
    amount: overview.amount,
    completePct: overview.schemaFieldCount !== 0 ? parseInt((overview.fieldCount / overview.schemaFieldCount) * 100) : 0,
    errorCount: errors,
    section: section,
    _feed: feed
  });
};
