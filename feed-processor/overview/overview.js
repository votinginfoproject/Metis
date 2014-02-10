/**
 * Created by rcartier13 on 2/5/14.
 */

var config = require('../../config');
var mongoose = require('mongoose');
var schemas = require('../../dao/schemas');
var query = require('./mongooseQuery');
var async = require('async');

var overviewData = [];

mongoose.connect(config.mongoose.connectionString);
console.log("initialized VIP database via Mongoose");
schemas.initSchemas(mongoose);
countUp(function(total) {
  console.log('Finished Counting');
  var count = 0;
//  var wait = function() {
//    if(++count === 6)
//      mongoose.disconnect();
//  };
//
//  for(var i = 0; i < overviewData.length; i++) {
//    console.log('Saving ' + overviewData[i].type + ' Overview');
//    createModel(overviewData[i]).save(wait);
//  }
  console.log('Total fields for a Ballot: ', total);
  mongoose.disconnect();
});

function countUp(callback) {
  var ballotTotal = 0;

  schemas.models.Feed.find({})
    .populate('_id')
    .exec(run);

  function run(err, data) {
    var feedId = data[0]._id;
    if(err)
      console.log('Feed not found');


    schemas.models.Contest.find({ _feed: feedId })
      .populate('_ballot')
      .exec(function(err, contests) {
        async.each(contests, function(contest, callback) {
          var count = 0;
          contestBallot(contest._ballot, feedId, function(total) {
            console.log(total);
            ballotTotal += total;
            if(++count === 3)
              callback();
          });
        }, function(err) { callback(ballotTotal) });
      });
//    console.log(feedId);
//    query.pollingLocations(feedId, wait);
//    query.contests(feedId, wait);
  };
};

function contestBallot(ballot, feedId, returnTotal) {
  var ballotTotal = Object.keys(ballot).length;
  if(ballot.referendumIds)
    --ballotTotal;
  if(ballot.candidates)
    --ballotTotal;
  if(ballot.referenda)
    --ballotTotal;

  returnTotal(ballotTotal);

  var candidateTotal = 0;
  async.each(ballot.candidates, function(candidate, callback) {
    schemas.models.Candidate.find({ _feed: feedId, _id: candidate._candidate })
      .exec(function(err, data) {
        if(err) {
          callback('Did not find Candidate');
          return;
        }

        var candidate = data[0]._doc;
        candidateTotal += Object.keys(candidate).length - 1;
        if(candidate.filedMailingAddress) {
          --candidateTotal;
          candidateTotal += Object.keys(candidate.filedMailingAddress).length;
        }
        callback();
      });
  }, function(err) { returnTotal(candidateTotal); });

  var referendumTotal = 0;
  async.each(ballot._referenda, function(referendum, referendaCB) {
    schemas.models.Referendum.find({ _feed: feedId, _id: referendum })
      .exec(function(err, data) {
        if(err) {
          callback('Did not find Referendum');
          return;
        }
        var referendum = data[0]._doc;
        referendumTotal += Object.keys(referendum).length - 1;
        if(referendum.ballotResponses) {
          async.each(referendum.ballotResponses, function(response, responsesCB) {
            referendumTotal += Object.keys(response).length - 1;
            responsesCB();
          }, function(err) { referendaCB(); });
        } else {
          referendaCB();
        }
      });
  }, function(err) { returnTotal(referendumTotal); });
}

function createModel(data) {
  return new schemas.models.Overview({
    element_type: data.type,
    amount: data.count,
    complete_pct: data.complete,
    error_count: data.error,
    section: data.section
  });
}