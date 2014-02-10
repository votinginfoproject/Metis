/**
 * Created by rcartier13 on 2/6/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');

function contestBallotCalc(ballot, feedId, returnTotal) {
  var ballotTotal = Object.keys(ballot).length - 4;
  var ballotSchemaCount = schemas.models.Ballot.fieldCount;
  var totalFinished = 0;
  var waitTillDone = function(fieldTotal, schemaFieldTotal) {
    ballotTotal += fieldTotal;
    ballotSchemaCount += schemaFieldTotal;
    if(++totalFinished === 2)
      returnTotal(ballotTotal, ballotSchemaCount);
  }

  ballot.candidates ? ballotCandidateCalc(ballot, feedId, waitTillDone) : waitTillDone(0,0);
  ballot._referenda ? ballotReferendumCalc(ballot, feedId, waitTillDone) : waitTillDone(0,0);
}

function ballotCandidateCalc(ballot, feedId, done) {
  var candidateTotal = 0;
  var schemaFieldTotal = 0;
  async.each(ballot.candidates, function(candidate, callback) {
    schemas.models.Candidate.find({ _feed: feedId, _id: candidate._candidate })
      .exec(function(err, data) {
        if(err) {
          callback('Did not find Candidate');
          return;
        }
        schemaFieldTotal += schemas.models.Candidate.fieldCount;
        var candidate = data[0]._doc;
        candidateTotal += Object.keys(candidate).length - 2;
        if(candidate.filedMailingAddress) {
          --candidateTotal;
          candidateTotal += Object.keys(candidate.filedMailingAddress).length;
        }
        callback();
      });
  }, function(err) { done(candidateTotal, schemaFieldTotal); });
}

function ballotReferendumCalc(ballot, feedId, done) {
  var referendumTotal = 0;
  var schemaFieldTotal = 0;
  async.each(ballot._referenda, function(referendum, referendaCB) {
    schemas.models.Referendum.find({ _feed: feedId, _id: referendum })
      .exec(function(err, data) {
        if(err) {
          callback('Did not find Referendum');
          return;
        }
        schemaFieldTotal += schemas.models.Referendum.fieldCount;
        var referendum = data[0]._doc;
        referendumTotal += Object.keys(referendum).length - 2;
        if(referendum.ballotResponses) {
          async.each(referendum.ballotResponses, function(response, responsesCB) {
            referendumTotal += Object.keys(response).length - 2;
            responsesCB();
          }, function(err) { referendaCB(); });
        } else {
          referendaCB();
        }
      });
  }, function(err) { done(referendumTotal, schemaFieldTotal); });
}

function contestContestResultCalc(contest, contestOverview) {
  contestOverview.contestResultAmount += contest._contestResult ? 1 : 0;
  contestOverview.contestResultFields += contest._contestResult ? Object.keys(contest._contestResult).length - 5 : 0;
  contestOverview.contestResultSchemaFieldCount += contest._contestResult ? schemas.models.ContestResult.fieldCount : 0;
}

function contestBallotLineResultCalc(contest, contestOverview) {
  contest._ballotLineResults.forEach(function(result) {
    ++contestOverview.ballotLineResultAmount;
    contestOverview.ballotLineResultFields += Object.keys(result).length - 6;
    contestOverview.ballotLineResultSchemaFieldCount += schemas.models.BallotLineResult.fieldCount;
  });
}

function contestElectoralDistrictCalc(electoralDistrict, feedId, returnTotal) {
  var districtFields = Object.keys(electoralDistrict).length - 6;
  var districtSchemaCount = schemas.models.ElectoralDistrict.fieldCount;
  returnTotal(districtFields, districtSchemaCount);
}

function electoralDistrictPrecinctsCalc(electoralDistrict, feedId, returnTotal) {
  var precinctsTotal = 0;
  var schemaFieldTotal = 0;
  var precinctCount = 0;
  async.each(electoralDistrict._precincts, function(precinctId, done) {
    schemas.models.Precinct.find({ _feed: feedId, _id: precinctId })
      .populate('_pollingLocations')
      .populate('_streetSegments')
      .exec(function(err, precinct) {
        precinctsTotal += Object.keys(precinct).length - 9;
        schemaFieldTotal += schemas.models.Precinct.fieldCount;
        async.each(precinct._pollingLocations, function(pollingLocation, cb) {
          precinctsTotal += Object.keys(pollingLocation).length - 5;
          schemaFieldTotal += schemas.models.PollingLocation.fieldCount;
          if(pollingLocation.address) {
            --precinctsTotal;
            precinctsTotal += Object.keys(pollingLocation.address).length;
          }
          cb();
        }, function(err) {
            if(++precinctCount === 2)
              done();
          });
        async.each(precinct._streetSegments, function(segment, cb) {
          precinctsTotal += Object.keys(segment).length - 3;
          schemaFieldTotal += schemas.models.StreetSegment.fieldCount;
          if(segment.nonHouseAddress) {
            --precinctsTotal;
            precinctsTotal += Object.keys(segment.nonHouseAddress).length;
          }
          cb();
        }, function(err) {
            if(++precinctCount === 2)
              done();
          });
      });
  }, function(err) { returnTotal(precinctsTotal, schemaFieldTotal); });
}

function electoralDistrictPrecinctSplitsCalc(electoralDistrict, feedId, returnTotal) {
  var precinctSplitTotal = 0;
  var schemaFieldTotal = 0;
    // 7
  async.each(electoralDistrict._precinctSplits, function(precinctSplitId, done) {
    schemas.models.PrecinctSplit.find({ _feed: feedId, _id: precinctSplitId })
      .exec(function(err, precinctSplit) {
        precinctSplitTotal += Object.keys(precinctSplit).length - 7;
        schemaFieldTotal += schemas.models.PrecinctSplit.fieldCount;
      });
  }, function(err) { returnTotal(precinctSplitTotal, schemaFieldTotal); })
}

exports.contestBallotCalc = contestBallotCalc;
exports.contestContestResultCalc = contestContestResultCalc;
exports.contestBallotLineResultCalc = contestBallotLineResultCalc;
exports.contestElectoralDistrictCalc = contestElectoralDistrictCalc;