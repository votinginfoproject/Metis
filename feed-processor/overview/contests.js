/**
 * Created by rcartier13 on 2/6/14.
 */

var schemas = require('../../dao/schemas');
var async = require('async');
var util = require('./utils');

function kickoffContest(feedId, createOverviewModel, wait) {
  console.log('Starting Contests Calc...');
  contestCalc(feedId, function(contestOverview) {
    console.log('Finished Contests');
    createOverviewModel('Ballots', contestOverview.ballots, contestOverview.ballots.errorCount, -2, feedId);
    createOverviewModel('Candidates', contestOverview.candidates, contestOverview.candidates.errorCount, -2, feedId);
    createOverviewModel('Contests', contestOverview.contests, contestOverview.contests.errorCount, -2, feedId);
    createOverviewModel('Electoral Districts', contestOverview.electoralDistricts, contestOverview.electoralDistricts.errorCount, -2, feedId);
    createOverviewModel('Referenda', contestOverview.referenda, contestOverview.referenda.errorCount, -2, feedId);
    wait();
  });
}

function contestCalc(feedId, saveCalc) {
  var contestsOverview = { };
  var paramsList = [];

  paramsList.push(util.createParamList(feedId, 0, schemas.models.contests, function(res, cb) {
    contestsOverview.contests = res;
    schemas.models.contests.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.contests.errorCount = count;
      cb();
    });
  }));

  paramsList.push(util.createParamList(feedId, 0, schemas.models.ballots, function(res, cb) {
    contestsOverview.ballots = res;
    schemas.models.ballots.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.ballots.errorCount = count;
      cb();
    });
  }));

  paramsList.push(util.createParamList(feedId, 0, schemas.models.candidates, function(res, cb) {
    contestsOverview.candidates = res;
    schemas.models.candidates.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.candidates.errorCount = count;
      cb();
    });
  }));

  paramsList.push(util.createParamList(feedId, 0, schemas.models.referendums, function(res, cb) {
    contestsOverview.referenda = res;
    schemas.models.referendums.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.referenda.errorCount = count;
      cb();
    });
  }));

  paramsList.push(util.createParamList(feedId, 0, schemas.models.electoraldistricts, function(res, cb) {
    contestsOverview.electoralDistricts = res;
    schemas.models.electoraldistricts.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.electoralDistricts.errorCount = count;
      cb();
    });
  }));

  async.eachSeries(paramsList, function(params, done) {
    var stream = util.streamOverviewObject(params);
    var overview = util.createOverviewObject();

    stream.on('data', function(doc) {
      overview.amount++;
      overview.fieldCount += util.countProperties(doc);
      overview.schemaFieldCount += params.model.fieldCount;
    });

    stream.on('end', function(err) {
      params.returnTotal(overview, done);
    });
  }, function(err) { saveCalc(contestsOverview); });
}

exports.kickoffContest = kickoffContest;
exports.contestCalc = contestCalc;