var schemas = require('../../dao/schemas');
var utils = require('./utils');
var async = require('async');

function pollingLocationsCalc(feedId, saveCalc) {
  var pollinglocationsOverview = { };
  var pollinglocationsCount = 0;
  function wait() {
    if(++pollinglocationsCount === 8)
      saveCalc(pollinglocationsOverview);
  }
  utils.findOverviewObject(feedId, 0, schemas.models.EarlyVoteSite, function(res) {
    pollinglocationsOverview.earlyvotesites = res;
    schemas.models.EarlyVoteSite.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.earlyvotesites.errorCount = count;
      wait()
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.ElectionAdmin, function(res) {
    pollinglocationsOverview.electionadministrations = res;
    schemas.models.ElectionAdmin.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.electionadministrations.errorCount = count;
      wait();
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.ElectionOfficial, function(res) {
    pollinglocationsOverview.electionofficials = res;
    schemas.models.ElectionOfficial.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.electionofficials.errorCount = count;
      wait();
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.Locality, function(res) {
    pollinglocationsOverview.localities = res;
    schemas.models.Locality.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.localities.errorCount = count;
      wait();
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.PollingLocation, function(res) {
    pollinglocationsOverview.pollinglocations = res;
    schemas.models.PollingLocation.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.pollinglocations.errorCount = count;
      wait();
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.Precinct, function(res) {
    pollinglocationsOverview.precincts = res;
    schemas.models.Precinct.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.precincts.errorCount = count;
      wait();
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.PrecinctSplit, function(res) {
    pollinglocationsOverview.precinctsplits = res;
    schemas.models.PrecinctSplit.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.precinctsplits.errorCount = count;
      wait();
    });
  });
  utils.findOverviewObject(feedId, 0, schemas.models.StreetSegment, function(res) {
    pollinglocationsOverview.streetsegments = res;
    schemas.models.StreetSegment.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.streetsegments.errorCount = count;
      wait();
    });
  });
}

exports.pollingLocationsCalc = pollingLocationsCalc;