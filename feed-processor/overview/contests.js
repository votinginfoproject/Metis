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
  util.findOverviewObject(feedId, 0, schemas.models.Contest, function(res) { contestsOverview.contests = res; wait() });
  util.findOverviewObject(feedId, 0, schemas.models.Ballot, function(res) { contestsOverview.ballots = res; wait(); });
  util.findOverviewObject(feedId, 0, schemas.models.Candidate, function(res) { contestsOverview.candidates = res; wait(); });
  util.findOverviewObject(feedId, 0, schemas.models.Referendum, function(res) { contestsOverview.referenda = res; wait(); });
  util.findOverviewObject(feedId, 0, schemas.models.ElectoralDistrict, function(res) { contestsOverview.electoralDistricts = res; wait(); });
}

exports.contestCalc = contestCalc;