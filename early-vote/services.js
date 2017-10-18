var elections = require('./elections');
var early_vote_sites = require('./early-vote-sites');

function registerEarlyVoteServices(app) {
  elections.registerElectionServices(app);
  early_vote_sites.registerEarlyVoteSiteServices(app);
}

exports.registerEarlyVoteServices = registerEarlyVoteServices;
