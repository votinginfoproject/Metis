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

        contestOverview[overviewPos].ballot = util.createOverviewObject(1, util.countProperties(contest._ballot), schemas.models.Ballot.fieldCount);
        contestOverview[overviewPos].electoralDistrict = util.createOverviewObject(1, util.countProperties(contest._electoralDistrict), schemas.models.ElectoralDistrict.fieldCount);

        util.findOverviewObject(feedId, contest._ballot._doc.candidates, schemas.models.Candidate, function(res) { contestOverview[overviewPos].candidate = res; wait(); });
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
        util.findOverviewObject(feedId, current._doc.ballotResponses, schemas.models.BallotResponse, function(res) { util.addOverviewObjects(initial, res); done(); });
      }
      else
        done();

    }, function(err) { returnTotal(initial) });
  });
}

exports.contestCalc = contestCalc;