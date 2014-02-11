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
      var contestFields = contestOverview.contestFields + contestOverview.ballotFields + contestOverview.contestResultFields + contestOverview.ballotLineResultFields;
      var contestSchemaFieldCount = contestOverview.contestSchemaFieldCount + contestOverview.ballotSchemaFieldCount + contestOverview.contestResultSchemaFieldCount +
        contestOverview.ballotLineResultSchemaFieldCount;
      createOverviewModel('Contests', contestOverview.contestAmount, contestFields, contestSchemaFieldCount, -1, 1);
      createOverviewModel('Ballots', contestOverview.contestAmount, contestOverview.ballotFields, contestOverview.ballotSchemaFieldCount, -1, 1);
      createOverviewModel('Contest Results', contestOverview.contestResultAmount, contestOverview.contestResultFields, contestOverview.contestResultSchemaFieldCount, -1, 1);
      createOverviewModel('Ballot Line Results', contestOverview.ballotLineResultAmount, contestOverview.ballotLineResultFields, contestOverview.ballotLineResultSchemaFieldCount, -1, 1);
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
