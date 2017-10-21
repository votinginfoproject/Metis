var elections = require('./elections');

function registerEarlyVoteServices(app) {
  elections.registerElectionServices(app);
}

exports.registerEarlyVoteServices = registerEarlyVoteServices;
