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

  util.findOverviewObject(feedId, 0, schemas.models.ContestResult, function(res) { resultsOverview.contestResults = res; wait(); });
  util.findOverviewObject(feedId, 0, schemas.models.BallotLineResult, function(res) { resultsOverview.ballotLineResults = res; wait(); });
}

exports.resultsCalc = resultsCalc;