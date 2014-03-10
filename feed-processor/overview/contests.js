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
  util.findOverviewObject(feedId, 0, schemas.models.Contest, function(res) {
    contestsOverview.contests = res;
    schemas.models.Contest.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.contests.errorCount = count;
      wait();
    });
  });
  util.findOverviewObject(feedId, 0, schemas.models.Ballot, function(res) {
    contestsOverview.ballots = res;
    schemas.models.Ballot.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.ballots.errorCount = count;
      wait();
    });
  });
  util.findOverviewObject(feedId, 0, schemas.models.Candidate, function(res) {
    contestsOverview.candidates = res;
    schemas.models.Candidate.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.candidates.errorCount = count;
      wait();
    });
  });
  util.findOverviewObject(feedId, 0, schemas.models.Referendum, function(res) {
    contestsOverview.referenda = res;
    schemas.models.Referendum.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.referenda.errorCount = count;
      wait();
    });
  });
  util.findOverviewObject(feedId, 0, schemas.models.ElectoralDistrict, function(res) {
    contestsOverview.electoralDistricts = res;
    schemas.models.ElectoralDistrict.Error.count({_feed: feedId}, function(err, count) {
      contestsOverview.electoralDistricts.errorCount = count;
      wait();
    });
  });
}

exports.contestCalc = contestCalc;