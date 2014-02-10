/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var query = require('./mongooseQuery');
var async = require('async');

mongoose.connect(config.mongoose.connectionString);
console.log("initialized VIP database via Mongoose");
schemas.initSchemas(mongoose);
calculateFields(function(contestOverview) {
  console.log('Finished Contests Calc.');
  console.log('Amount of Contests: ', contestOverview.contestAmount);
  console.log('Total fields in all contests: ', contestOverview.contestFields);
  console.log('Amount of Ballots: ', contestOverview.ballotAmount);
  console.log('Total fields in all Ballots: ', contestOverview.ballotFields);
  mongoose.disconnect();
});

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
      .exec(function(err, contests) {
        contestOverview.ballotAmount = contests.length;
        contestOverview.contestAmount = contests.length;
        contestOverview.ballotFields = 0;
        contestOverview.contestFields = 0;
        async.each(contests, function(contest, done) {
          var count = 0;
          query.contestBallotCalc(contest._ballot, feedId, function(total) {
            //console.log(total);
            contestOverview.ballotFields += total;
            contestOverview.contestFields += total;
            done();
          });
        }, function(err) { saveCalc(contestOverview) });
      });
  };
};