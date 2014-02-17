/**
 * Created by rcartier13 on 2/6/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function contestCalc(feedId, saveCalc) {

  var contestsOverview = { };
  var contestCount = 0;
  function wait() {
    if(++contestCount === 5)
      saveCalc(contestsOverview);
  }
  schemas.models.Contest.find({ _feed: feedId }, function(err, results) {
    var initial = util.createOverviewObject();
    results.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 6;
      memo.schemaFieldCount += schemas.models.Contest.fieldCount;
      return memo;
    }, initial);
    contestsOverview.contests = initial;
    wait();
  });

  contestBallotCalc(feedId, function(res) { contestsOverview.ballots = res; wait(); });
  contestCandidateCalc(feedId, function(res) { contestsOverview.candidates = res; wait(); });
  contestReferendumCalc(feedId, function(res) {contestsOverview.referenda = res; wait(); });
  contestElectoralDistrictCalc(feedId, function(res) { contestsOverview.electoralDistricts = res; wait(); });
}

function contestBallotCalc(feedId, returnTotal) {
  schemas.models.Ballot.find({ _feed: feedId }, function(err, ballots) {
    var initial = util.createOverviewObject();
    ballots.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 4;
      memo.schemaFieldCount += schemas.models.Ballot.fieldCount;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function contestCandidateCalc(feedId, returnTotal) {
  schemas.models.Candidate.find({ _feed: feedId }, function (err, candidates) {
    var initial = util.createOverviewObject();
    candidates.reduce(function (memo, current) {
      memo.amount++;
      memo.schemaFieldCount += schemas.models.Candidate.fieldCount;
      memo.fieldCount += Object.keys(current._doc).length - 2;
      if(current._doc.sortOrder)
        memo.fieldCount--;
      if (current._doc.filedMailingAddress) {
        memo.fieldCount += Object.keys(current._doc.filedMailingAddress).length - 1;
      }
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function contestReferendumCalc(feedId, returnTotal) {
  schemas.models.Referendum.find({ _feed: feedId }, function(err, referenda) {
    var initial = util.createOverviewObject();
    referenda.reduce(function(memo, current) {
      memo.amount++;
      memo.schemaFieldCount += schemas.models.Referendum.fieldCount;
      memo.fieldCount += Object.keys(current._doc).length - 3;
      if(current._doc.ballotResponses)
        memo.fieldCount--;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

function contestElectoralDistrictCalc(feedId, returnTotal) {
  schemas.models.ElectoralDistrict.find({ _feed: feedId }, function(err, districts) {
    var initial = util.createOverviewObject();
    districts.reduce(function(memo, current) {
      memo.amount++;
      memo.fieldCount += Object.keys(current._doc).length - 6;
      memo.schemaFieldCount += schemas.models.ElectoralDistrict.fieldCount;
      return memo;
    }, initial);
    returnTotal(initial);
  });
}

exports.contestCalc = contestCalc;