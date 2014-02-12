/**
 * Created by rcartier13 on 2/11/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');

function contestCalc(feedId, saveCalc) {
  var contestOverview = [];
  schemas.models.Contest.find({ _feed: feedId })
    .populate('_ballot')
    .populate('_electoralDistrict')
    .exec(function(err, contests) {

      async.each(contests, function(data, done) {
        var counter = 0;
        function wait() {
          if(++counter === 4)
            done();
        }

        var contest = data._doc;
        contestOverview.push({ section: contest.elementId });
        var overviewPos = contestOverview.length - 1;

        contestBallotCalc(contest._ballot, function(amount, fieldCount, schemaFieldCount) {
          contestOverview[overviewPos].ballot = {
            amount: amount,
            fieldCount: fieldCount,
            schemaFieldCount: schemaFieldCount
          }
          wait();
        });
        contestCandidateCalc(contest._ballot, function(amount, fieldCount, schemaFieldCount) {
          contestOverview[overviewPos].candidate = {
            amount: amount,
            fieldCount: fieldCount,
            schemaFieldCount: schemaFieldCount
          }
          wait();
        });

        contestReferendumCalc(feedId, contest._ballot, function(amount, fieldCount, schemaFieldCount) {
          contestOverview[overviewPos].referenda = {
            amount: amount,
            fieldCount: fieldCount,
            schemaFieldCount: schemaFieldCount
          }
          wait();
        });

        contestElectoralDistrictCalc(contest._electoralDistrict, function(amount, fieldCount, schemaFieldCount) {
          contestOverview[overviewPos].electoralDistrict = {
            amount: amount,
            fieldCount: fieldCount,
            schemaFieldCount: schemaFieldCount
          }
          wait();
        })

      }, function(err) { saveCalc(contestOverview); });

    });
}

function contestBallotCalc(ballot, returnTotal) {
  var amount = 1;
  var fieldCount = Object.keys(ballot._doc).length - 5;
  var schemaFieldCount = schemas.models.Ballot.fieldCount;
  returnTotal(amount, fieldCount, schemaFieldCount);
}

function contestCandidateCalc(ballot, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  ballot._doc.candidates.forEach(function(data) {
    var candidate = data._doc;
    ++amount;
    fieldCount += Object.keys(candidate).length - 3;
    schemaFieldCount += schemas.models.Candidate.fieldCount;
    if(candidate.filedMailingAddress) {
      fieldCount += Object.keys(candidate.filedMailingAddress).length - 1;
    }
  });
  returnTotal(amount, fieldCount, schemaFieldCount);
}

function contestReferendumCalc(feedId, ballot, returnTotal) {
  var amount = 0, fieldCount = 0, schemaFieldCount = 0;
  async.each(ballot._doc._referenda, function(referendumId, done) {
    schemas.models.Referendum.find({_feed: feedId, _id: referendumId})
      .exec(function(err, data) {
        var referendum = data[0]._doc;
        ++amount;
        fieldCount += Object.keys(referendum).length - 3;
        schemaFieldCount += schemas.models.Referendum.fieldCount;
        if(referendum.ballotResponses) {
          --fieldCount;
          referendumBallotResponseCalc(feedId, referendum.ballotResponses, function(resFieldCount, resSchemaFieldCount) {
            fieldCount += resFieldCount;
            schemaFieldCount += resSchemaFieldCount;
            done();
          });
        }
        else
          done();
      })
  }, function(err) { returnTotal(amount, fieldCount, schemaFieldCount); })
}

function referendumBallotResponseCalc(feedId, responses, returnTotals) {
  var fieldCount = 0, schemaFieldCount = 0;
  async.each(responses, function(responseId, done) {
    schemas.models.BallotResponse.find({_feed: feedId, _id: responseId._response })
      .exec(function(err, data) {
        var response = data[0]._doc;
        fieldCount += Object.keys(response).length - 3;
        schemaFieldCount += schemas.models.BallotResponse.fieldCount;
        // Since sort order is optional do not count
        if(response.sortOrder)
          --fieldCount;
        done();
      });
  }, function(err) { returnTotals(fieldCount, schemaFieldCount); });
}

function contestElectoralDistrictCalc(district, returnTotals) {
  var amount = 1;
  var fieldCount = Object.keys(district._doc).length - 6;
  var schemaFieldCount = schemas.models.ElectoralDistrict.fieldCount;
  returnTotals(amount, fieldCount, schemaFieldCount);
}

exports.contestCalc = contestCalc;