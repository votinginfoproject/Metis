var elections = require('./elections');
var early_vote_sites = require('./early-vote-sites');
var schedules = require('./schedules');
var assignments = require('./assignments');
var auth = require('../authentication/services.js');

function registerEarlyVoteServices(app) {
  app.all('/earlyvote/*', auth.checkJwt);
  elections.registerElectionServices(app);
  early_vote_sites.registerEarlyVoteSiteServices(app);
  schedules.registerScheduleServices(app);
  assignments.registerAssignmentServices(app);
}

exports.registerEarlyVoteServices = registerEarlyVoteServices;
