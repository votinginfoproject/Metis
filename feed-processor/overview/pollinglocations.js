var schemas = require('../../dao/schemas');
var utils = require('./utils');
var async = require('async');

function pollinglocationsCalc(feedId, saveCalc) {

  var pollinglocationsOverview = { };
  var pollinglocationsCount = 0;

  // wait for each of the Calc functions to finish
  function wait() {
    if(++pollinglocationsCount === 1)
      saveCalc(pollinglocationsOverview);
  }

  earlyVoteSitesCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.earlyvotesites = {};
    pollinglocationsOverview.earlyvotesites.amount = amount;
    pollinglocationsOverview.earlyvotesites.fieldTotal = fieldTotal;
    pollinglocationsOverview.earlyvotesites.schemaFieldTotal = schemaFieldTotal;
    wait();
  });

  /*
  electionAdministrationsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.electionadministration.amount = amount;
    pollinglocationsOverview.electionadministration.fieldTotal = fieldTotal;
    pollinglocationsOverview.electionadministration.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  localitiesCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.localities.amount = amount;
    pollinglocationsOverview.localities.fieldTotal = fieldTotal;
    pollinglocationsOverview.localities.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  precinctsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.precincts.amount = amount;
    pollinglocationsOverview.precincts.fieldTotal = fieldTotal;
    pollinglocationsOverview.precincts.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  precinctSplitsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.precinctsplits.amount = amount;
    pollinglocationsOverview.precinctsplits.fieldTotal = fieldTotal;
    pollinglocationsOverview.precinctsplits.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  pollingLocationsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.pollinglocations.amount = amount;
    pollinglocationsOverview.pollinglocations.fieldTotal = fieldTotal;
    pollinglocationsOverview.pollinglocations.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  streetSegmentsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.streetSegments.amount = amount;
    pollinglocationsOverview.streetSegments.fieldTotal = fieldTotal;
    pollinglocationsOverview.streetSegments.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
*/
}

function earlyVoteSitesCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.EarlyVoteSite.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldTotal += utils.countProperties(result);
        schemaFieldTotal += schemas.models.ContestResult.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}

exports.pollinglocationsCalc = pollinglocationsCalc;