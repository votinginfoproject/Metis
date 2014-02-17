/**
 * Created by rcartier13 on 2/11/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function contestCalc(feedId, saveCalc) {
  var contestOverview = [];
  schemas.models.Contest.find({ _feed: feedId })
    .populate('_ballot')
    .populate('_electoralDistrict')
    .exec(function(err, contests) {

      async.each(contests, function(data, done) {
        var counter = 0;
        function wait() {
          if(++counter === 2)
            done();
        }

        var contest = data._doc;
        contestOverview.push({ section: contest.elementId });
        var overviewPos = contestOverview.length - 1;

        contestOverview[overviewPos].ballot = contestBallotCalc(contest._ballot);
        contestOverview[overviewPos].electoralDistrict = contestElectoralDistrictCalc(contest._electoralDistrict);

        contestCandidateCalc(feedId, contest._ballot, function(res) { contestOverview[overviewPos].candidate = res; wait(); });
        contestReferendumCalc(feedId, contest._ballot, function(res) { contestOverview[overviewPos].referenda = res; wait(); });
      }, function(err) { saveCalc(contestOverview); });

    });
}

function contestBallotCalc(ballot) {
  var result = util.createOverviewObject(1);
  result.fieldCount = Object.keys(ballot._doc).length - 4;
  if(ballot._doc._customBallot)
    result.fieldCount--;
  if(ballot._doc.candidates)
    result.fieldCount--;
  result.schemaFieldCount = schemas.models.Ballot.fieldCount;
  return result;
}

function contestCandidateCalc(feedId, ballot, returnTotal) {
  schemas.models.Candidate.find( { _feed: feedId, _id: { $in: ballot._doc.candidates } }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 3;
      memo.schemaFieldCount += schemas.models.Candidate.fieldCount;
      if(current._doc.sortOrder)
        memo.fieldCount--;
      if(current._doc.filedMailingAddress)
        memo.fieldCount += Object.keys(current._doc.filedMailingAddress).length - 1;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function contestReferendumCalc(feedId, ballot, returnTotal) {
  schemas.models.Referendum.find({_feed: feedId, _id: { $in: ballot._doc._referenda } }, function(err, results) {
    var initial = util.createOverviewObject();
    async.each(results, function(current, done) {
      initial.amount++;
      initial.fieldCount += Object.keys(current._doc).length - 3;
      initial.schemaFieldCount += schemas.models.Referendum.fieldCount;
      if(current._doc.ballotResponses) {
        initial.fieldCount--;
        referendumBallotResponseCalc(feedId, current._doc.ballotResponses, function(res) { util.addOverviewObjects(initial, res); done(); });
      }
      else
        done();
    }, function(err) { returnTotal(initial) });
  });
}

function referendumBallotResponseCalc(feedId, responses, returnTotals) {
  schemas.models.BallotResponse.find({_feed: feedId, _id: { $in: responses } }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.fieldCount += Object.keys(current._doc).length - 3;
      memo.schemaFieldCount += schemas.models.BallotResponse.fieldCount;
      if(current._doc.sortOrder)
        memo.fieldCount--;
      return memo;
    }, initial);
    returnTotals(initial);
  });
}

function contestElectoralDistrictCalc(district) {
  var result = util.createOverviewObject(1);
  result.fieldCount = Object.keys(district._doc).length - 6;
  result.schemaFieldCount = schemas.models.ElectoralDistrict.fieldCount;
  return result;
}

exports.contestCalc = contestCalc;