var elections = require('./elections');
var early_vote_sites = require('./early-vote-sites');
var schedules = require('./schedules');
var assignments = require('./assignments');
var auth = require('../authentication/services.js');
var file_generation = require('./file-generation');

function registerEarlyVoteServices(app) {
  app.all('/earlyvote/*', auth.checkJwt);
  elections.registerElectionServices(app);
  early_vote_sites.registerEarlyVoteSiteServices(app);
  schedules.registerScheduleServices(app);
  assignments.registerAssignmentServices(app);
  file_generation.registerFileGenerationServices(app);
}

exports.registerEarlyVoteServices = registerEarlyVoteServices;
