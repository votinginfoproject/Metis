var util = require('./util.js');
var queries = require('./queries.js');

var errorResponder = function(query, params) {
  return util.simpleQueryResponder(query, util.paramExtractor(params));
}

module.exports = {
  overviewErrors: function(table) { return errorResponder(queries.overallErrorQuery(table)); },

  getFeedContestBallotErrors: errorResponder(queries.contestBallotErrors, ['contestid']),
  getFeedErrors: errorResponder(queries.errors),
}
