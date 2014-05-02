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

  paramList.push(utils.createParamList(feedId, 0, schemas.models.earlyVoteSites, function (res, cb) {
    pollinglocationsOverview.earlyvotesites = res;
    schemas.models.earlyVoteSites.Error.count({_feed: feedId}, function (err, count) {
      pollinglocationsOverview.earlyvotesites.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.electionAdmins, function(res, cb) {
    pollinglocationsOverview.electionadministrations = res;
    schemas.models.electionAdmins.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.electionadministrations.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.electionOfficials, function(res, cb) {
    pollinglocationsOverview.electionofficials = res;
    schemas.models.electionOfficials.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.electionofficials.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.localitys, function(res, cb) {
    pollinglocationsOverview.localities = res;
    schemas.models.localitys.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.localities.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.pollingLocations, function(res, cb) {
    pollinglocationsOverview.pollinglocations = res;
    schemas.models.pollingLocations.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.pollinglocations.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.precincts, function(res, cb) {
    pollinglocationsOverview.precincts = res;
    schemas.models.precincts.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.precincts.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.precinctSplits, function(res, cb) {
    pollinglocationsOverview.precinctsplits = res;
    schemas.models.precinctSplits.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.precinctsplits.errorCount = count;
      cb();
    });
  }));

  paramList.push(utils.createParamList(feedId, 0, schemas.models.streetSegments, function(res, cb) {
    pollinglocationsOverview.streetsegments = res;
    schemas.models.streetSegments.Error.count({_feed: feedId}, function(err, count) {
      pollinglocationsOverview.streetsegments.errorCount = count;
      cb();
    });
  }));

  async.eachSeries(paramList, function(params, done) {
    var stream = utils.streamOverviewObject(params);
    var overview = utils.createOverviewObject();
    stream.on('data', function(doc) {
      if(!doc)
        console.log('document is null');

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