var util = require('./util.js');
var queries = require('./queries.js');

module.exports = {
  getFeedBallotErrors: util.simpleQueryResponder(queries.ballotErrors, util.paramExtractor()),
  getFeedBallotErrorExample: util.simpleQueryResponder(queries.ballotErrorExample, util.paramExtractor(['error_type'])),
  getFeedContestBallotErrors: util.simpleQueryResponder(queries.contestBallotErrors, util.paramExtractor(['contestid'])),
  getFeedContestBallotErrorExample: util.simpleQueryResponder(queries.contestBallotErrorExample, util.paramExtractor(['contestid', 'error_type']))
}
