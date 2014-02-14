var schemas = require('../../dao/schemas');
var utils = require('./utils');
var async = require('async');

function pollinglocationsCalc(feedId, saveCalc) {

  var pollinglocationsOverview = { };
  var pollinglocationsCount = 0;

  // wait for each of the Calc functions to finish
  function wait() {
    if(++pollinglocationsCount === 5)
      saveCalc(pollinglocationsOverview);
  }

  earlyVoteSitesCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.earlyvotesites = {};
    pollinglocationsOverview.earlyvotesites.amount = amount;
    pollinglocationsOverview.earlyvotesites.fieldTotal = fieldTotal;
    pollinglocationsOverview.earlyvotesites.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  electionAdministrationsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.electionadministration = {};
    pollinglocationsOverview.electionadministration.amount = amount;
    pollinglocationsOverview.electionadministration.fieldTotal = fieldTotal;
    pollinglocationsOverview.electionadministration.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  localitiesCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.localities = {};
    pollinglocationsOverview.localities.amount = amount;
    pollinglocationsOverview.localities.fieldTotal = fieldTotal;
    pollinglocationsOverview.localities.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  pollingLocationsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.pollinglocations = {};
    pollinglocationsOverview.pollinglocations.amount = amount;
    pollinglocationsOverview.pollinglocations.fieldTotal = fieldTotal;
    pollinglocationsOverview.pollinglocations.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  precinctsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.precincts = {};
    pollinglocationsOverview.precincts.amount = amount;
    pollinglocationsOverview.precincts.fieldTotal = fieldTotal;
    pollinglocationsOverview.precincts.schemaFieldTotal = schemaFieldTotal;
    wait();
  });
  /*
  streetSegmentsCalc(feedId, function(fieldTotal, schemaFieldTotal, amount) {
    pollinglocationsOverview.streetSegments.amount = amount;
    pollinglocationsOverview.streetSegments.fieldTotal = fieldTotal;
    pollinglocationsOverview.streetSegments.schemaFieldTotal = schemaFieldTotal;
    wait();
  });

   early vote sites
   election administrations
   localities
   polling locations
   precincts

   state, , , , , precinct splits,
    and street segments
   that is what i believe the slist is
   the last two polling locations and street segments im not 100% sure about
*/
}

function earlyVoteSitesCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.EarlyVoteSite.find({_feed: feedId})
    .exec(function(err, results) {

      console.log("earlyVoteSitesCalc: " + results.length);
      results.forEach( function(result){
        ++amount;
        fieldTotal += utils.countProperties(result);
        schemaFieldTotal += schemas.models.EarlyVoteSite.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}

function electionAdministrationsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.ElectionAdmin.find({_feed: feedId})
    .exec(function(err, results) {

      console.log("electionAdministrationsCalc: " + results.length);
      results.forEach( function(result){
        ++amount;
        fieldTotal += utils.countProperties(result);
        schemaFieldTotal += schemas.models.ElectionAdmin.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}

function localitiesCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.Locality.find({_feed: feedId})
    .exec(function(err, results) {

      console.log("localitiesCalc: " + results.length);
      results.forEach( function(result){
        ++amount;
        fieldTotal += utils.countProperties(result);
        schemaFieldTotal += schemas.models.Locality.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}

function pollingLocationsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.PollingLocation.find({_feed: feedId})
    .exec(function(err, results) {

      console.log("pollingLocationsCalc: " + results.length);
      results.forEach( function(result){
        ++amount;
        fieldTotal += utils.countProperties(result);
        schemaFieldTotal += schemas.models.PollingLocation.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}

function precinctsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.Precinct.find({_feed: feedId})
    .exec(function(err, results) {

      console.log("precinctsCalc: " + results.length);
      results.forEach( function(result){
        ++amount;
        fieldTotal += utils.countProperties(result);
        schemaFieldTotal += schemas.models.Precinct.fieldCount;
      });
      returnTotal(fieldTotal, schemaFieldTotal, amount);
    });
}
exports.pollinglocationsCalc = pollinglocationsCalc;