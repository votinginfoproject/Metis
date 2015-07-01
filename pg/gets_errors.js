var util = require('./util.js');
var queries = require('./queries.js');

var errorResponder = function(query, params) {
  return util.simpleQueryResponder(query, util.paramExtractor(params));
}

module.exports = {
  overviewErrors: function(table) { return errorResponder(queries.overallErrorQuery(table)); },

  getFeedCandidateErrors: errorResponder(queries.candidateErrors, ['candidateid']),
  getFeedContestBallotErrors: errorResponder(queries.contestBallotErrors, ['contestid']),
  getFeedContestErrors: errorResponder(queries.contestErrors, ['contestid']),
  getFeedErrors: errorResponder(queries.errors),
}
