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
  getFeedLocalityEarlyVoteSitesErrors: errorResponder(queries.localityEarlyVoteSitesErrors, ['localityid']),
  getFeedLocalityElectionAdministrationsErrors: errorResponder(queries.localityElectionAdministrationsErrors, ['localityid']),
  getFeedLocalityPollingLocationsErrors: errorResponder(queries.localityPollingLocationsErrors, ['localityid']),
  getFeedLocalityPrecinctSplitsErrors: errorResponder(queries.localityPrecinctSplitsErrors, ['localityid']),
  getFeedLocalityPrecinctsErrors: errorResponder(queries.localityPrecinctsErrors, ['localityid']),
  getFeedLocalityStreetSegmentsErrors: errorResponder(queries.localityStreetSegmentsErrors, ['localityid']),
  getFeedPrecinctSplitsErrors: errorResponder(queries.precinctSplitsErrors, ['precinctsplitid']),
  getFeedErrors: errorResponder(queries.errors),
}
