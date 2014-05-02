/**
 * Created by rcartier13 on 2/11/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function kickoffContest(feedId, createOverviewModel, wait) {
  console.log('Starting Single Contest Calc...');
  contestCalc(feedId, function(contestOverview) {
    console.log('Finished Single Contest');
    contestOverview.forEach(function(overview) {
      createOverviewModel('Ballot', overview.ballot, overview.ballot.errorCount, overview.section, feedId);
      createOverviewModel('Candidates', overview.candidate, overview.candidate.errorCount, overview.section, feedId);
      createOverviewModel('Electoral District', overview.electoralDistrict, overview.electoralDistrict.errorCount, overview.section, feedId);
      createOverviewModel('Referenda', overview.referenda, overview.referenda.errorCount, overview.section, feedId);
    });
    wait();
  });
}

function contestCalc(feedId, saveCalc) {
  var contestOverview = [];
  schemas.models.contests.find({ _feed: feedId })
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

        var count = 1;
        if (!contest._ballot)
          count = 0;

        contestOverview[overviewPos].ballot = util.createOverviewObject(count, util.countProperties(contest._ballot), schemas.models.ballots.fieldCount, 0);
        schemas.models.ballots.Error.count({_ref: contest._ballot}, function (err, count) {
          contestOverview[overviewPos].ballot.errorCount = count;
          wait();
        });

        count = 1;
        if(!contest._electoralDistrict)
          count = 0;

        contestOverview[overviewPos].electoralDistrict = util.createOverviewObject(count, util.countProperties(contest._electoralDistrict), schemas.models.electoraldistricts.fieldCount, 0);
        schemas.models.electoraldistricts.Error.count({_ref: contest._electoralDistrict}, function(err, count) {
          contestOverview[overviewPos].electoralDistrict.errorCount = count;
          wait();
        });

        if(contest._ballot) {
          var candidates = util.convertObjArrToIdArr(contest._ballot.candidates);
          util.findOverviewObject(feedId, candidates, schemas.models.candidates, function (res) {
            contestOverview[overviewPos].candidate = res;
            schemas.models.candidates.Error.count({_ref: {$in: candidates}}, function (err, count) {
              contestOverview[overviewPos].candidate.errorCount = count;
              wait();
            });
          });
        }
        else {
          contestOverview[overviewPos].candidate = util.createOverviewObject();
          wait();
        }

        if(contest._ballot) {
          contestReferendumCalc(feedId, contest._ballot, function (res) {
            contestOverview[overviewPos].referenda = res;
            wait();
          });
        }
        else {
          contestOverview[overviewPos].referenda = util.createOverviewObject();
          wait();
        }


      }, function(err) { saveCalc(contestOverview); });

    });
}
function contestReferendumCalc(feedId, ballot, returnTotal) {
  schemas.models.referendums.find({_feed: feedId, _id: { $in: ballot._referenda } }, function(err, results) {
    var initial = util.createOverviewObject();
    async.each(results, function(current, done) {

      initial.amount++;
      initial.fieldCount += util.countProperties(current);
      initial.schemaFieldCount += schemas.models.referendums.fieldCount;
      if(current._doc.ballotResponses) {
        util.findOverviewObject(feedId, util.convertObjArrToIdArr(current.ballotResponses), schemas.models.ballotresponses, function(res) {
          util.addOverviewObjects(initial, res);
          schemas.models.ballotresponses.Error.count({_ref: {$in: util.convertObjArrToIdArr(current.ballotResponses)}}, function(err, count) {
            initial.errorCount += count;
            done();
          })
        });
      }
      else
        done();

    }, function(err) {
      schemas.models.referendums.Error.count({_ref: {$in: results}}, function(err, count) {
        initial.errorCount += count;
        returnTotal(initial);
      });
    });
  });
}

exports.kickoffContest = kickoffContest;
exports.contestCalc = contestCalc;