var util = require('./util.js');
var queries = require('./queries.js');

var errorResponder = function(query, params) {
  return util.simpleQueryResponder(query, util.paramExtractor(params));
}

module.exports = {
  overviewErrors: function(table) { return errorResponder(queries.overallErrorQuery(table)); },

  getFeedErrors: errorResponder(queries.errors),

  v3: {
    getFeedCandidateErrors: errorResponder(queries.candidateErrors, ['candidateid']),
    getFeedContestBallotErrors: errorResponder(queries.contestBallotErrors, ['contestid']),
    getFeedContestCandidatesErrors: errorResponder(queries.contestCandidatesErrors, ['contestid']),
    getFeedContestElectoralDistrictErrors: errorResponder(queries.contestElectoralDistrictErrors, ['contestid']),
    getFeedContestReferendaErrors: errorResponder(queries.contestReferendaErrors, ['contestid']),
    getFeedContestErrors: errorResponder(queries.contestErrors, ['contestid']),
    getFeedEarlyVoteSiteErrors: errorResponder(queries.earlyVoteSiteErrors, ['earlyvotesiteid']),
    getFeedLocalityEarlyVoteSitesErrors: errorResponder(queries.localityEarlyVoteSitesErrors, ['localityid']),
    getFeedLocalityElectionAdministrationsErrors: errorResponder(queries.localityElectionAdministrationsErrors, ['localityid']),
    getFeedLocalityPollingLocationsErrors: errorResponder(queries.localityPollingLocationsErrors, ['localityid']),
    getFeedLocalityPrecinctSplitsErrors: errorResponder(queries.localityPrecinctSplitsErrors, ['localityid']),
    getFeedLocalityPrecinctsErrors: errorResponder(queries.localityPrecinctsErrors, ['localityid']),
    getFeedPrecinctStreetSegmentsErrors: errorResponder(queries.precinctStreetSegmentsErrors, ['precinctid']),
    getFeedLocalityStreetSegmentsErrors: errorResponder(queries.localityStreetSegmentsErrors, ['localityid']),
    getFeedPrecinctSplitsErrors: errorResponder(queries.precinctSplitsErrors, ['precinctsplitid']),
    getFeedElectoralDistrictsErrors: errorResponder(queries.electoralDistrictsErrors, ['electoraldistrictid']),
  }
}
