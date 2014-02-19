var schemas = require('../../dao/schemas');
var utils = require('./utils');
var async = require('async');

function pollingLocationsCalc(feedId, saveCalc) {
  var pollinglocationsOverview = { };
  var pollinglocationsCount = 0;
  function wait() {
    if(++pollinglocationsCount === 7)
      saveCalc(pollinglocationsOverview);
  }
  utils.findOverviewObject(feedId, 0, schemas.models.EarlyVoteSite, function(res) { pollinglocationsOverview.earlyvotesites = res; wait() });
  utils.findOverviewObject(feedId, 0, schemas.models.ElectionAdmin, function(res) { pollinglocationsOverview.electionadministrations = res; wait() });
  utils.findOverviewObject(feedId, 0, schemas.models.Locality, function(res) { pollinglocationsOverview.localities = res; wait() });
  utils.findOverviewObject(feedId, 0, schemas.models.PollingLocation, function(res) { pollinglocationsOverview.pollinglocations = res; wait() });
  utils.findOverviewObject(feedId, 0, schemas.models.Precinct, function(res) { pollinglocationsOverview.precincts = res; wait() });
  utils.findOverviewObject(feedId, 0, schemas.models.PrecinctSplit, function(res) { pollinglocationsOverview.precinctsplits = res; wait() });
  utils.findOverviewObject(feedId, 0, schemas.models.StreetSegment, function(res) { pollinglocationsOverview.streetsegments = res; wait() });
}

exports.pollingLocationsCalc = pollingLocationsCalc;