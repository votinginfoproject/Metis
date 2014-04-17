/**
 * Created by rcartier13 on 2/11/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function kickoffResults(feedId, createOverviewModel, wait) {
  console.log('Starting Results Calc...');
  resultsCalc(feedId, function(resultsOverview) {
    console.log('Finished Results');
    createOverviewModel('Ballot Line Results', resultsOverview.ballotLineResults, resultsOverview.ballotLineResults.errorCount, -3, feedId);
    createOverviewModel('Contest Results', resultsOverview.contestResults, resultsOverview.contestResults.errorCount, -3, feedId);
    wait();
  });
}

function resultsCalc(feedId, saveCalc) {
  var resultsOverview = { };
  var paramsList = [];

  paramsList.push(util.createParamList(feedId, 0, schemas.models.ContestResult, function(res, cb) {
    resultsOverview.contestResults = res;
    schemas.models.ContestResult.Error.count({}, function(err, count) {
      resultsOverview.contestResults.errorCount = count;
      cb();
    });
  }));

  paramsList.push(util.createParamList(feedId, 0, schemas.models.BallotLineResult, function(res, cb) {
    resultsOverview.ballotLineResults = res;
    schemas.models.BallotLineResult.Error.count({}, function(err, count) {
      resultsOverview.ballotLineResults.errorCount = count;
      cb();
    });
  }));

  async.eachSeries(paramsList, function(params, done) {
    var stream = util.streamOverviewObject(params);
    var overview = util.createOverviewObject();
    stream.on('data', function(doc) {
      overview.amount++;
      overview.fieldCount += util.countProperties(doc);
      overview.schemaFieldCount += params.model.fieldCount;
    });

    stream.on('end', function(err) {
      params.returnTotal(overview, done);
    });

  }, function() { saveCalc(resultsOverview); });
}

exports.kickoffResults = kickoffResults;
exports.resultsCalc = resultsCalc;