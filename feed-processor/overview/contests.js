/**
 * Created by rcartier13 on 2/6/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');

function contestCalc(feedId, saveCalc) {

  var contestOverview = { };
  var contestCount = 0;
  function wait() {
    if(++contestCount === 5)
      saveCalc(contestOverview);
  }
  schemas.models.Contest.find({ _feed: feedId })
    .exec(function(err, contests) {
      contestOverview.contestAmount = contests.length;
      contestOverview.contestFieldCount = contestOverview.contestSchemaFieldCount = 0;
      async.each(contests, function(contest, done) {
        contestOverview.contestFieldCount += Object.keys(contest).length - 6;
        contestOverview.contestSchemaFieldCount += schemas.models.Contest.fieldCount;
        done();
      }, function(err) { wait() });
    });

  contestBallotCalc(feedId, function(amount, fieldCount, schemaFieldCount) {
    contestOverview.ballotAmount = amount;
    contestOverview.ballotFieldCount = fieldCount;
    contestOverview.ballotSchemaFieldCount = schemaFieldCount;
    wait();
  });

  contestCandidateCalc(feedId, function(amount, fieldCount, schemaFieldCount) {
    contestOverview.candidateAmount = amount;
    contestOverview.candidateFieldCount = fieldCount;
    contestOverview.candidateSchemaFieldCount = schemaFieldCount;
    wait();
  });

  contestReferendumCalc(feedId, function(amount, fieldCount, schemaFieldCount) {
    contestOverview.referendumAmount = amount;
    contestOverview.referendumFieldCount = fieldCount;
    contestOverview.referendumSchemaFieldCount = schemaFieldCount;
    wait();
  });

  contestElectoralDistrictCalc(feedId, function(amount, fieldCount, schemaFieldCount) {
    contestOverview.electoralDistrictAmount = amount;
    contestOverview.electoralDistrictFieldCount = fieldCount;
    contestOverview.electoralDistrictSchemaFieldCount = schemaFieldCount;
    wait();
  });
}

function contestBallotCalc(feedId, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  schemas.models.Ballot.find({ _feed: feedId })
    .exec(function(err, ballots) {
      amount = ballots.length;
      async.each(ballots, function(ballot, done) {
        fieldCount += Object.keys(ballot).length - 4;
        schemaFieldCount += schemas.models.Ballot.fieldCount;
        done();
      }, function(err) { returnTotal(amount, fieldCount, schemaFieldCount); });
    });
}

function contestCandidateCalc(feedId, returnTotal) {
  var amount = 0;
  var candidateTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.Candidate.find({ _feed: feedId })
    .exec(function (err, candidates) {
      amount = candidates.length;
      async.each(candidates, function (candidate, done) {
        schemaFieldTotal += schemas.models.Candidate.fieldCount;
        candidateTotal += Object.keys(candidate).length - 2;
        if (candidate.filedMailingAddress) {
          --candidateTotal;
          candidateTotal += Object.keys(candidate.filedMailingAddress).length;
        }
        done();
      }, function (err) { returnTotal(amount, candidateTotal, schemaFieldTotal); });
    });
}

function contestReferendumCalc(feedId, returnTotal) {
  var amount;
  var referendumTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.Referendum.find({ _feed: feedId })
    .exec(function(err, referenda) {
      amount = referenda.length;
      async.each(referenda, function(referendum, done) {
        schemaFieldTotal += schemas.models.Referendum.fieldCount;
        referendumTotal += Object.keys(referendum).length - 2;
        if(referendum.ballotResponses.length) {
          async.each(referendum.ballotResponses, function(response, responsesCB) {
            referendumTotal += Object.keys(response).length - 2;
            responsesCB();
          }, function(err) { done(); });
        }
        else {
          done();
        }
      }, function(err) { returnTotal(amount, referendumTotal, schemaFieldTotal); });
  });
}

function contestElectoralDistrictCalc(feedId, returnTotal) {
  var amount = 0;
  var districtFields = 0;
  var districtSchemaCount = 0;

  schemas.models.ElectoralDistrict.find({ _feed: feedId })
    .exec(function(err, districts) {
      amount = districts.length;
      async.each(districts, function(district, done) {
        districtFields += Object.keys(district).length - 6;
        districtSchemaCount += schemas.models.ElectoralDistrict.fieldCount;
        done();
      }, function(err) { returnTotal(amount, districtFields, districtSchemaCount); });
    })
}

exports.contestCalc = contestCalc;