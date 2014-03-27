var schemas = require('../../dao/schemas');
var utils = require('./utils');
var async = require('async');

function kickoffPollingLoc(feedId, createOverviewModel, wait) {
  console.log('Starting Localities Calc...');
  pollingLocationsCalc(feedId, function(pollinglocationsOverview) {
    console.log('Finished Localities');
    createOverviewModel('Early Vote Sites', pollinglocationsOverview.earlyvotesites, pollinglocationsOverview.earlyvotesites.errorCount, -1, feedId);
    createOverviewModel('Election Administrations', pollinglocationsOverview.electionadministrations, pollinglocationsOverview.electionadministrations.errorCount, -1, feedId);
    createOverviewModel('Election Officials', pollinglocationsOverview.electionofficials, pollinglocationsOverview.electionofficials.errorCount, -1, feedId);
    createOverviewModel('Localities', pollinglocationsOverview.localities, pollinglocationsOverview.localities.errorCount, -1, feedId);
    createOverviewModel('Polling Locations', pollinglocationsOverview.pollinglocations, pollinglocationsOverview.pollinglocations.errorCount, -1, feedId);
    createOverviewModel('Precincts', pollinglocationsOverview.precincts, pollinglocationsOverview.precincts.errorCount, -1, feedId);
    createOverviewModel('Precinct Splits', pollinglocationsOverview.precinctsplits, pollinglocationsOverview.precinctsplits.errorCount, -1, feedId);
    createOverviewModel('Street Segments', pollinglocationsOverview.streetsegments, pollinglocationsOverview.streetsegments.errorCount, -1, feedId);
    wait();
  });
}

function pollingLocationsCalc(feedId, saveCalc) {
  var pollinglocationsOverview = { };
  var paramList = [];

  paramList.push(utils.createParamList(feedId, 0, schemas.models.EarlyVoteSite, function (res, cb) {
    pollinglocationsOverview.earlyvotesites = res;
    schemas.models.EarlyVoteSite.Error.count({_feed: feedId}, function (err, count) {
      pollinglocationsOverview.earlyvotesites.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.ElectionAdmin, function(res, cb) {
    pollinglocationsOverview.electionadministrations = res;
    schemas.models.ElectionAdmin.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.electionadministrations.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.ElectionOfficial, function(res, cb) {
    pollinglocationsOverview.electionofficials = res;
    schemas.models.ElectionOfficial.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.electionofficials.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.Locality, function(res, cb) {
    pollinglocationsOverview.localities = res;
    schemas.models.Locality.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.localities.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.PollingLocation, function(res, cb) {
    pollinglocationsOverview.pollinglocations = res;
    schemas.models.PollingLocation.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.pollinglocations.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.Precinct, function(res, cb) {
    pollinglocationsOverview.precincts = res;
    schemas.models.Precinct.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.precincts.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.PrecinctSplit, function(res, cb) {
    pollinglocationsOverview.precinctsplits = res;
    schemas.models.PrecinctSplit.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.precinctsplits.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.StreetSegment, function(res, cb) {
    pollinglocationsOverview.streetsegments = res;
    schemas.models.StreetSegment.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.streetsegments.errorCount = count;
      cb();
    });
  }));

  async.eachSeries(paramList, function(params, done) {
    var stream = utils.streamOverviewObject(params);
    var overview = utils.createOverviewObject();
    stream.on('data', function(doc) {
      overview.amount++;
      overview.fieldCount += utils.countProperties(doc);
      overview.schemaFieldCount += params.model.fieldCount;
    });

    stream.on('end', function(err) {
      params.returnTotal(overview, done);
    });

  }, function() { saveCalc(pollinglocationsOverview); });
}

exports.pollingLocationsCalc = pollingLocationsCalc;
exports.kickoffPollingLoc = kickoffPollingLoc;