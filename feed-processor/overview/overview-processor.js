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

  function run(err, feeds) {
    if(err)
      console.log('Feed not found');

    async.each(feeds, function(feed, done) {

      var feedId = feed._doc._id;
      var fieldCount = 0;
      function wait() {
        if(++fieldCount === 3)
          done();
      }

      console.log('Starting Contests Calc...');
      contests.contestCalc(feedId, function(contestOverview) {
        console.log('Finished Contests');
        createOverviewModel('Ballots', contestOverview.ballotAmount, contestOverview.ballotFieldCount, contestOverview.ballotSchemaFieldCount, -1, 1);
        createOverviewModel('Candidates', contestOverview.candidateAmount, contestOverview.candidateFieldCount, contestOverview.candidateSchemaFieldCount, -1, 1);
        createOverviewModel('Contests', contestOverview.contestAmount, contestOverview.contestFieldCount, contestOverview.contestSchemaFieldCount, -1, 1);
        createOverviewModel('Electoral Districts', contestOverview.electoralDistrictAmount, contestOverview.electoralDistrictFieldCount, contestOverview.electoralDistrictSchemaFieldCount, -1, 1);
        createOverviewModel('Referenda', contestOverview.referendumAmount, contestOverview.referendumFieldCount, contestOverview.referendumSchemaFieldCount, -1, 1);
        wait();
      });

      console.log('Starting Results Calc...');
      results.resultsCalc(feedId, function(resultsOverview) {
        console.log('Finished Results');
        createOverviewModel('Contest Results', resultsOverview.contestResultsAmount, resultsOverview.contestResultsFieldTotal, resultsOverview.contestResultsSchemaFieldTotal, -1, 2);
        createOverviewModel('Ballot Line Results', resultsOverview.ballotLineResultsAmount, resultsOverview.ballotLineResultsFieldTotal, resultsOverview.ballotLineResultSchemaFieldTotal, -1, 2);
        wait();
      });

      console.log('Starting Single Contest Calc...');
      contest.contestCalc(feedId, function(contestOverview) {
        console.log('Finsihed Single Contest');
        contestOverview.forEach(function(overview) {
          createOverviewModel('Ballot', overview.ballot.amount, overview.ballot.fieldCount, overview.ballot.schemaFieldCount, -1, overview.section);
          createOverviewModel('Candidates', overview.candidate.amount, overview.candidate.fieldCount, overview.candidate.schemaFieldCount, -1, overview.section);
          createOverviewModel('Electoral District', overview.electoralDistrict.amount, overview.electoralDistrict.fieldCount, overview.electoralDistrict.schemaFieldCount, -1, overview.section);
          createOverviewModel('Referenda', overview.referenda.amount, overview.referenda.fieldCount, overview.referenda.schemaFieldCount, -1, overview.section);
        });
        wait();
      });
    }, function(err) { saveCalc(); });
  };
};

function createOverviewModel(name, amount, num, denom, errors, section) {
  overviewModels.push({
    elementType: name,
    amount: amount,
    completePct: denom !== 0 ? parseInt((num / denom) * 100) : 0,
    errorCount: errors,
    section: section
  });
};
