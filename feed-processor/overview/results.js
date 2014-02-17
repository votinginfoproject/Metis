/**
 * Created by rcartier13 on 2/11/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function resultsCalc(feedId, saveCalc) {
  var resultsOverview = { };
  var resultCount = 0;
  function wait() {
    if(++resultCount === 2)
      saveCalc(resultsOverview);
  }

  contestResultsCalc(feedId, function(res) { resultsOverview.contestResults = res; wait(); });
  ballotLineResultCalc(feedId, function(res) { resultsOverview.ballotLineResults = res; wait(); });
}

function contestResultsCalc(feedId, returnTotal) {
  schemas.models.ContestResult.find({_feed: feedId}, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 5;
      memo.schemaFieldCount += schemas.models.ContestResult.fieldCount;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function ballotLineResultCalc(feedId, returnTotal) {
  schemas.models.BallotLineResult.find( { _feed: feedId }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 6;
      memo.schemaFieldCount += schemas.models.BallotLineResult.fieldCount;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

exports.resultsCalc = resultsCalc;
// Exported so they can be tested
exports.contestResultsCalc = contestResultsCalc;
exports.ballotLineResultCalc = ballotLineResultCalc;