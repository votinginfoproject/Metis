var schemas = require('../../dao/schemas');
var utils = require('./utils');
var async = require('async');

function pollingLocationsCalc(feedId, saveCalc) {

  var pollinglocationsOverview = { };
  var pollinglocationsCount = 0;

  // wait for each of the Calc functions to finish
  function wait() {
    if(++pollinglocationsCount === 7)
      saveCalc(pollinglocationsOverview);
  }

  earlyVoteSitesCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.earlyvotesites = {};
    pollinglocationsOverview.earlyvotesites.amount = amount;
    pollinglocationsOverview.earlyvotesites.fieldCount = fieldCount;
    pollinglocationsOverview.earlyvotesites.schemaFieldCount = schemaFieldCount;
    wait();
  });
  electionAdministrationsCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.electionadministrations = {};
    pollinglocationsOverview.electionadministrations.amount = amount;
    pollinglocationsOverview.electionadministrations.fieldCount = fieldCount;
    pollinglocationsOverview.electionadministrations.schemaFieldCount = schemaFieldCount;
    wait();
  });
  localitiesCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.localities = {};
    pollinglocationsOverview.localities.amount = amount;
    pollinglocationsOverview.localities.fieldCount = fieldCount;
    pollinglocationsOverview.localities.schemaFieldCount = schemaFieldCount;
    wait();
  });
  pollinglocationsCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.pollinglocations = {};
    pollinglocationsOverview.pollinglocations.amount = amount;
    pollinglocationsOverview.pollinglocations.fieldCount = fieldCount;
    pollinglocationsOverview.pollinglocations.schemaFieldCount = schemaFieldCount;
    wait();
  });
  precinctsCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.precincts = {};
    pollinglocationsOverview.precincts.amount = amount;
    pollinglocationsOverview.precincts.fieldCount = fieldCount;
    pollinglocationsOverview.precincts.schemaFieldCount = schemaFieldCount;
    wait();
  });
  precinctsplitsCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.precinctsplits = {};
    pollinglocationsOverview.precinctsplits.amount = amount;
    pollinglocationsOverview.precinctsplits.fieldCount = fieldCount;
    pollinglocationsOverview.precinctsplits.schemaFieldCount = schemaFieldCount;
    wait();
  });
  streetsegmentsCalc(feedId, function(fieldCount, schemaFieldCount, amount) {
    pollinglocationsOverview.streetsegments = {};
    pollinglocationsOverview.streetsegments.amount = amount;
    pollinglocationsOverview.streetsegments.fieldCount = fieldCount;
    pollinglocationsOverview.streetsegments.schemaFieldCount = schemaFieldCount;
    wait();
  });

}

function earlyVoteSitesCalc(feedId, returnTotal) {

  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.EarlyVoteSite.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.EarlyVoteSite.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

function electionAdministrationsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.ElectionAdmin.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.ElectionAdmin.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

function localitiesCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.Locality.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.Locality.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

function pollinglocationsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.PollingLocation.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.PollingLocation.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

function precinctsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.Precinct.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.Precinct.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

function precinctsplitsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.PrecinctSplit.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.PrecinctSplit.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

function streetsegmentsCalc(feedId, returnTotal) {
  var amount = 0;
  var fieldCount = 0;
  var schemaFieldCount = 0;
  schemas.models.StreetSegment.find({_feed: feedId})
    .exec(function(err, results) {
      results.forEach( function(result){
        ++amount;
        fieldCount += utils.countProperties(result);
        schemaFieldCount += schemas.models.StreetSegment.fieldCount;
      });
      returnTotal(fieldCount, schemaFieldCount, amount);
    });
}

exports.pollingLocationsCalc = pollingLocationsCalc;