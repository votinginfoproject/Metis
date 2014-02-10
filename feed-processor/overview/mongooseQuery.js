/**
 * Created by rcartier13 on 2/6/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');

function contestBallotCalc(ballot, feedId, returnTotal) {
  var ballotTotal = Object.keys(ballot).length;
  if(ballot.candidates)
    --ballotTotal;
  if(ballot.referenda)
    --ballotTotal;

  var totalFinished = 0;
  var waitTillDone = function(fieldTotal) {
    ballotTotal += fieldTotal;
    if(++totalFinished === 2)
      returnTotal(ballotTotal);
  }

  ballotCandidateCalc(ballot, feedId, waitTillDone);
  ballotReferendumCalc(ballot, feedId, waitTillDone);
}

function ballotCandidateCalc(ballot, feedId, done) {
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
  }, function(err) { done(candidateTotal); });
}

function ballotReferendumCalc(ballot, feedId, done) {
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
  }, function(err) { done(referendumTotal); });
}

exports.contestBallotCalc = contestBallotCalc;