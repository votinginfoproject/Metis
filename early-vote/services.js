var elections = require('./elections');
var early_vote_sites = require('./early-vote-sites');
var schedules = require('./schedules');

function registerEarlyVoteServices(app) {
  elections.registerElectionServices(app);
  early_vote_sites.registerEarlyVoteSiteServices(app);
  schedules.registerScheduleServices(app);
}

exports.registerEarlyVoteServices = registerEarlyVoteServices;
