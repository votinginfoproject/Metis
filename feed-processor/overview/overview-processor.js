/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var async = require('async');
var when = require('when');

var contests = require('./contests');
var results = require('./results');
var contest = require('./contest');
var locality = require('./locality');
var pollinglocations = require('./pollinglocations');

var overviewModels = [];

function runOverviewProcessor(feedId) {
calculateFields(feedId, function() {
    var createOverviews = [];

    console.log('Saving models');
    overviewModels.forEach(function(overview) {
      createOverviews.push(schemas.models.Overview.create(overview));
    });

    when.all(createOverviews).then(onSaveComplete, errorHandler);
  });
}

function errorHandler(err) {
  console.error(err);
}

function onSaveComplete(results) {
  mongoose.disconnect();
  process.exit();
}

function calculateFields(feedId, saveCalc) {
  var calcCount = 0;
  function wait() {
    if(++calcCount === 5)
      saveCalc();
  }

  console.log('Starting Localities Calc...');
  pollinglocations.pollingLocationsCalc(feedId, function(pollinglocationsOverview) {
    console.log('Finished Localities');
    createOverviewModel('Early Vote Sites', pollinglocationsOverview.earlyvotesites, pollinglocationsOverview.earlyvotesites.errorCount, 0, feedId);
    createOverviewModel('Election Administrations', pollinglocationsOverview.electionadministrations, pollinglocationsOverview.electionadministrations.errorCount, 0, feedId);
    createOverviewModel('Election Officilas', pollinglocationsOverview.electionofficials, pollinglocationsOverview.electionofficials.errorCount, 0, feedId);
    createOverviewModel('Localities', pollinglocationsOverview.localities, pollinglocationsOverview.localities.errorCount, 0, feedId);
    createOverviewModel('Polling Locations', pollinglocationsOverview.pollinglocations, pollinglocationsOverview.pollinglocations.errorCount, 0, feedId);
    createOverviewModel('Precincts', pollinglocationsOverview.precincts, pollinglocationsOverview.precincts.errorCount, 0, feedId);
    createOverviewModel('Precinct Splits', pollinglocationsOverview.precinctsplits, pollinglocationsOverview.precinctsplits.errorCount, 0, feedId);
    createOverviewModel('Street Segments', pollinglocationsOverview.streetsegments, pollinglocationsOverview.streetsegments.errorCount, 0, feedId);
    wait();
  });

  console.log('Starting Contests Calc...');
  contests.contestCalc(feedId, function(contestOverview) {
    console.log('Finished Contests');
    createOverviewModel('Ballots', contestOverview.ballots, contestOverview.ballots.errorCount, 1, feedId);
    createOverviewModel('Candidates', contestOverview.candidates, contestOverview.candidates.errorCount, 1, feedId);
    createOverviewModel('Contests', contestOverview.contests, contestOverview.contests.errorCount, 1, feedId);
    createOverviewModel('Electoral Districts', contestOverview.electoralDistricts, contestOverview.electoralDistricts.errorCount, 1, feedId);
    createOverviewModel('Referenda', contestOverview.referenda, contestOverview.referenda.errorCount, 1, feedId);
    wait();
  });

  console.log('Starting Results Calc...');
  results.resultsCalc(feedId, function(resultsOverview) {
    console.log('Finished Results');
    createOverviewModel('Contest Results', resultsOverview.contestResults, resultsOverview.contestResults.errorCount, 2, feedId);
    createOverviewModel('Ballot Line Results', resultsOverview.ballotLineResults, resultsOverview.ballotLineResults.errorCount, 2, feedId);
    wait();
  });

  console.log('Starting Single Contest Calc...');
  contest.contestCalc(feedId, function(contestOverview) {
    console.log('Finished Single Contest');
    contestOverview.forEach(function(overview) {
      createOverviewModel('Ballot', overview.ballot, overview.ballot.errorCount, overview.section, feedId);
      createOverviewModel('Candidates', overview.candidate, overview.candidate.errorCount, overview.section, feedId);
      createOverviewModel('Electoral District', overview.electoralDistrict, overview.electoralDistrict.errorCount, overview.section, feedId);
      createOverviewModel('Referenda', overview.referenda, overview.referenda.errorCount, overview.section, feedId);
    });
    wait();
  });

  console.log('Starting Single Locality Calc...');
  locality.localityCalc(feedId, function(localityOverview) {
    console.log('Finished Single Locality');
    localityOverview.forEach(function(overview) {
      createOverviewModel('Early Vote Sites', overview.earlyVoteSites, overview.earlyVoteSites.errorCount, overview.section, feedId);
      createOverviewModel('Election Administration', overview.electionAdmin, overview.electionAdmin.errorCount, overview.section, feedId);
      createOverviewModel('Precincts', overview.precincts, overview.precincts.errorCount, overview.section, feedId);
      createOverviewModel('Precinct Splits', overview.precinctSplits, overview.precinctSplits.errorCount, overview.section, feedId);
      createOverviewModel('Polling Locations', overview.pollingLocations, overview.pollingLocations.errorCount, overview.section, feedId);
      createOverviewModel('Street Segments', overview.streetSegments, overview.streetSegments.errorCount, overview.section, feedId);
    });
    wait();
  });
};

function createOverviewModel(name, overview, errors, section, feed) {
  overviewModels.push({
    elementType: name,
    amount: overview.amount,
    completePct: overview.schemaFieldCount !== 0 ? parseInt((overview.fieldCount / overview.schemaFieldCount) * 100) : 0,
    errorCount: errors,
    section: section,
    _feed: feed
  });
};

exports.runOverviewProcessor = runOverviewProcessor;
