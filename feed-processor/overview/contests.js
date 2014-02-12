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
      contests.forEach(function(data) {
        var contest = data._doc;
        contestOverview.contestFieldCount += Object.keys(contest).length - 6;
        contestOverview.contestSchemaFieldCount += schemas.models.Contest.fieldCount;
      });
      wait();
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
      ballots.forEach(function(data) {
        var ballot = data._doc
        fieldCount += Object.keys(ballot).length - 4;
        schemaFieldCount += schemas.models.Ballot.fieldCount;
      });
      returnTotal(amount, fieldCount, schemaFieldCount);
    });
}

function contestCandidateCalc(feedId, returnTotal) {
  var amount = 0;
  var candidateTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.Candidate.find({ _feed: feedId })
    .exec(function (err, candidates) {
      amount = candidates.length;
      candidates.forEach(function (data) {
        var candidate = data._doc
        schemaFieldTotal += schemas.models.Candidate.fieldCount;
        candidateTotal += Object.keys(candidate).length - 2;
        if(candidate.sortOrder)
          --candidateTotal;
        if (candidate.filedMailingAddress) {
          --candidateTotal;
          candidateTotal += Object.keys(candidate.filedMailingAddress).length;
        }
      });
      returnTotal(amount, candidateTotal, schemaFieldTotal);
    });
}

function contestReferendumCalc(feedId, returnTotal) {
  var amount;
  var referendumTotal = 0;
  var schemaFieldTotal = 0;
  schemas.models.Referendum.find({ _feed: feedId })
    .exec(function(err, referenda) {
      amount = referenda.length;
      referenda.forEach(function(data) {
        var referendum = data._doc;
        schemaFieldTotal += schemas.models.Referendum.fieldCount;
        referendumTotal += Object.keys(referendum).length - 3;
        if(referendum.ballotResponses)
          --referendumTotal;
      });
      returnTotal(amount, referendumTotal, schemaFieldTotal);
  });
}

function contestElectoralDistrictCalc(feedId, returnTotal) {
  var amount = 0;
  var districtFields = 0;
  var districtSchemaCount = 0;

  schemas.models.ElectoralDistrict.find({ _feed: feedId })
    .exec(function(err, districts) {
      amount = districts.length;
      districts.forEach(function(data) {
        var district = data._doc
        districtFields += Object.keys(district).length - 6;
        districtSchemaCount += schemas.models.ElectoralDistrict.fieldCount;
      });
      returnTotal(amount, districtFields, districtSchemaCount);
    });
}

exports.contestCalc = contestCalc;