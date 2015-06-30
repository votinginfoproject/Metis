var util = require('./util.js');
var queries = require('./queries.js');

module.exports = {
  getFeedBallotErrors: util.simpleQueryResponder(queries.ballotErrors, util.paramExtractor()),
  getFeedContestBallotErrors: util.simpleQueryResponder(queries.contestBallotErrors, util.paramExtractor(['contestid'])),
}
