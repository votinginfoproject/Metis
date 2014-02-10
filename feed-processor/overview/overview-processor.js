/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var query = require('./mongooseQuery');
var async = require('async');
var when = require('when');

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
  var contestOverview = { };

  schemas.models.Feed.find({})
    .populate('_id')
    .exec(run);

  function run(err, data) {
    var feedId = data[0]._id;
    if(err)
      console.log('Feed not found');

    console.log('Starting Contests Calc...');
    schemas.models.Contest.find({ _feed: feedId })
      .populate('_ballot')
      .populate('_contestResult')
      .populate('_ballotLineResults')
      .populate('_electoralDistrict')
      .exec(function(err, contests) {
        contestOverview.contestAmount = contests.length;
        contestOverview.ballotFields = contestOverview.contestFields = contestOverview.ballotSchemaFieldCount = contestOverview.contestSchemaFieldCount = 0;
        contestOverview.contestResultFields = contestOverview.contestResultSchemaFieldCount = contestOverview.contestResultAmount = 0;
        contestOverview.ballotLineResultFields = contestOverview.ballotLineResultSchemaFieldCount = contestOverview.ballotLineResultAmount = 0;
        contestOverview.electoralDistrictFields = contestOverview.electoralDistrictFields = 0;
        async.each(contests, function(contest, done) {
          var contestCount = 0;
          contestOverview.contestFields += Object.keys(contest).length - 6;
          contestOverview.contestSchemaFieldCount += schemas.models.Contest.fieldCount;
          query.contestContestResultCalc(contest, contestOverview);
          query.contestBallotLineResultCalc(contest, contestOverview);
          query.contestBallotCalc(contest._ballot, feedId, function(total, schemaFieldCount) {
            contestOverview.ballotFields += total;
            contestOverview.ballotSchemaFieldCount += schemaFieldCount;
            if(++contestCount === 2)
              done();
          });
          query.contestElectoralDistrictCalc(contest._electoralDistrict, feedId, function(total, schemaFieldCount) {
            contestOverview.electoralDistrictFields += total;
            contestOverview.electoralDistrictSchemaFieldCount += schemaFieldCount;
            if(++contestCount === 2)
              done();
          })
        }, function(err) {
          console.log('Finished Contests');
          var contestFields = contestOverview.contestFields + contestOverview.ballotFields + contestOverview.contestResultFields + contestOverview.ballotLineResultFields;
          var contestSchemaFieldCount = contestOverview.contestSchemaFieldCount + contestOverview.ballotSchemaFieldCount + contestOverview.contestResultSchemaFieldCount +
              contestOverview.ballotLineResultSchemaFieldCount;
          createOverviewModel('Contests', contestOverview.contestAmount, contestFields, contestSchemaFieldCount, -1, 1);
          createOverviewModel('Ballots', contestOverview.contestAmount, contestOverview.ballotFields, contestOverview.ballotSchemaFieldCount, -1, 1);
          createOverviewModel('Contest Results', contestOverview.contestResultAmount, contestOverview.contestResultFields, contestOverview.contestResultSchemaFieldCount, -1, 1);
          createOverviewModel('Ballot Line Results', contestOverview.ballotLineResultAmount, contestOverview.ballotLineResultFields, contestOverview.ballotLineResultSchemaFieldCount, -1, 1);
          saveCalc();
        });
      });
  };
};

function createOverviewModel(name, amount, num, denom, errors, section) {
  overviewModels.push({
    elementType: name,
    amount: amount,
    // Parse number as Int so it loses the decimals and does not create a false 100%
    completePct: parseInt((num / denom) * 100),
    errorCount: errors,
    section: section
  });
};
