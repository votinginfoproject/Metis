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
          if(++counter === 4)
            done();
        }

        var contest = data._doc;
        contestOverview.push({ section: contest.elementId });
        var overviewPos = contestOverview.length - 1;

        contestOverview[overviewPos].ballot = util.createOverviewObject(1, util.countProperties(contest._ballot), schemas.models.Ballot.fieldCount, 0);
        schemas.models.Ballot.Error.count({_ref: contest._ballot}, function(err, count) {
          contestOverview[overviewPos].ballot.errorCount = count;
          wait();
        });

        contestOverview[overviewPos].electoralDistrict = util.createOverviewObject(1, util.countProperties(contest._electoralDistrict), schemas.models.ElectoralDistrict.fieldCount, 0);
        schemas.models.ElectoralDistrict.Error.count({_ref: contest._electoralDistrict}, function(err, count) {
          contestOverview[overviewPos].electoralDistrict.errorCount = count;
          wait();
        });

        util.findOverviewObject(feedId, contest._ballot._doc.candidates, schemas.models.Candidate, function(res) {
          contestOverview[overviewPos].candidate = res;
          schemas.models.Candidate.Error.count({_ref: {$in: contest._ballot._doc.candidates}}, function(err, count) {
            contestOverview[overviewPos].candidate.errorCount = count;
            wait();
          });
        });
        contestReferendumCalc(feedId, contest._ballot, function(res) { contestOverview[overviewPos].referenda = res; wait(); });

      }, function(err) { saveCalc(contestOverview); });

    });
}
function contestReferendumCalc(feedId, ballot, returnTotal) {
  schemas.models.Referendum.find({_feed: feedId, _id: { $in: ballot._doc._referenda } }, function(err, results) {
    var initial = util.createOverviewObject();
    async.each(results, function(current, done) {

      initial.amount++;
      initial.fieldCount += util.countProperties(current);
      initial.schemaFieldCount += schemas.models.Referendum.fieldCount;
      if(current._doc.ballotResponses) {
        util.findOverviewObject(feedId, current._doc.ballotResponses, schemas.models.BallotResponse, function(res) { util.addOverviewObjects(initial, res);
          schemas.models.BallotResponse.Error.count({_ref: {$in: current._doc.ballotResponses}}, function(err, count) {
            initial.errorCount += count;
            done();
          })
        });
      }
      else
        done();

    }, function(err) {
      schemas.models.Referendum.Error.count({_ref: {$in: results}}, function(err, count) {
        initial.errorCount += count;
        returnTotal(initial);
      });
    });
  });
}

exports.contestCalc = contestCalc;