/**
 * Created by rcartier13 on 2/11/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');

function resultsCalc(feedId, saveCalc) {
  var resultsOverview = { };
  var resultCount = 0;
  function wait() {
    if(++resultCount === 2)
      saveCalc(resultsOverview);
  }

  contestResultsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    resultsOverview.contestResultsAmount = amount;
    resultsOverview.contestResultsFieldTotal = fieldTotal;
    resultsOverview.contestResultsSchemaFieldTotal = schemaFieldTotal;
    wait();
  });
  ballotLineResultCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    resultsOverview.ballotLineResultsAmount = amount;
    resultsOverview.ballotLineResultsFieldTotal = fieldTotal;
    resultsOverview.ballotLineResultSchemaFieldTotal = schemaFieldTotal;
    wait();
  });
}

function contestResultsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.ContestResult.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach(function(result) {
        ++amount;
        fieldTotal += Object.keys(result).length - 5;
        schemaFieldTotal += schemas.models.ContestResult.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}

function ballotLineResultCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.BallotLineResult.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach(function(result) {
        ++amount;
        fieldTotal += Object.keys(result).length - 6;
        schemaFieldTotal += schemas.models.BallotLineResult.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    })
}

exports.resultsCalc = resultsCalc;