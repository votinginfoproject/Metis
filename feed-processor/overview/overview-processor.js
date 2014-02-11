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

var overviewModels = [];

mongoose.connect(config.mongoose.connectionString);
console.log("initialized VIP database via Mongoose");
schemas.initSchemas(mongoose);
calculateFields(function() {
  var createOverviews = [];

  console.log('Saving models');
  overviewModels.forEach(function(overview) {
    createOverviews.push(schemas.models.Overview.create(overview));
  });

  when.all(createOverviews).then(onSaveComplete, errorHandler);
});

function errorHandler(err) {
  console.error(err);
}

function onSaveComplete(results) {
  mongoose.disconnect();
  process.exit();
}

function calculateFields(saveCalc) {

  schemas.models.Feed.find({})
    .populate('_id')
    .exec(run);

  function run(err, data) {
    var feedId = data[0]._id;
    if(err)
      console.log('Feed not found');
    var fieldCount = 0;
    function wait() {
      if(++fieldCount === 2)
        saveCalc();
    }

    console.log('Starting Contests Calc...');
    contests.contestCalc(feedId, function(contestOverview) {
      console.log('Finished Contests');
      createOverviewModel('Ballots', contestOverview.ballotAmount, contestOverview.ballotFieldCount, contestOverview.ballotSchemaFieldCount, -1, 1);
      createOverviewModel('Candidates', contestOverview.candidateAmount, contestOverview.candidateFieldCount, contestOverview.candidateSchemaFieldCount, -1, 1);
      createOverviewModel('Contests', contestOverview.contestAmount, contestOverview.contestFieldCount, contestOverview.contestSchemaFieldCount, -1, 1);
      createOverviewModel('Electoral Districts', contestOverview.electoralDistrictAmount, contestOverview.electoralDistrictFieldCount, contestOverview.electoralDistrictSchemaFieldCount, -1, 1);
      wait();
    });

    console.log('Starting Results Calc...');
    results.resultsCalc(feedId, function(resultsOverview) {
      console.log('Finished Results');
      createOverviewModel('Contest Results', resultsOverview.contestResultsAmount, resultsOverview.contestResultsFieldTotal, resultsOverview.contestResultsSchemaFieldTotal, -1, 2);
      createOverviewModel('Ballot Line Results', resultsOverview.ballotLineResultsAmount, resultsOverview.ballotLineResultsFieldTotal, resultsOverview.ballotLineResultSchemaFieldTotal, -1, 2);
      wait();
    });
  };
};

function createOverviewModel(name, amount, num, denom, errors, section) {
  overviewModels.push({
    elementType: name,
    amount: amount,
    completePct: parseInt((num / denom) * 100),
    errorCount: errors,
    section: section
  });
};
