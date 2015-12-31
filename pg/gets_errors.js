var util = require('./util.js');
var queries = require('./queries.js');

var errorResponder = function(query, params) {
  return util.simpleQueryResponder(query, util.paramExtractor(params));
}

module.exports = {
  overviewErrors: function(table) { return errorResponder(queries.overallErrorQuery(table)); },

  getFeedErrors: errorResponder(queries.errors),

  v3: {
    getFeedCandidateErrors: errorResponder(queries.v3.candidateErrors, ['candidateid']),
    getFeedContestBallotErrors: errorResponder(queries.v3.contestBallotErrors, ['contestid']),
    getFeedContestCandidatesErrors: errorResponder(queries.v3.contestCandidatesErrors, ['contestid']),
    getFeedContestElectoralDistrictErrors: errorResponder(queries.v3.contestElectoralDistrictErrors, ['contestid']),
    getFeedContestReferendaErrors: errorResponder(queries.v3.contestReferendaErrors, ['contestid']),
    getFeedContestErrors: errorResponder(queries.v3.contestErrors, ['contestid']),
    getFeedEarlyVoteSiteErrors: errorResponder(queries.v3.earlyVoteSiteErrors, ['earlyvotesiteid']),
    getFeedLocalityEarlyVoteSitesErrors: errorResponder(queries.v3.localityEarlyVoteSitesErrors, ['localityid']),
    getFeedLocalityElectionAdministrationsErrors: errorResponder(queries.v3.localityElectionAdministrationsErrors, ['localityid']),
    getFeedLocalityPollingLocationsErrors: errorResponder(queries.v3.localityPollingLocationsErrors, ['localityid']),
    getFeedLocalityPrecinctSplitsErrors: errorResponder(queries.v3.localityPrecinctSplitsErrors, ['localityid']),
    getFeedLocalityPrecinctsErrors: errorResponder(queries.v3.localityPrecinctsErrors, ['localityid']),
    getFeedPrecinctStreetSegmentsErrors: errorResponder(queries.v3.precinctStreetSegmentsErrors, ['precinctid']),
    getFeedLocalityStreetSegmentsErrors: errorResponder(queries.v3.localityStreetSegmentsErrors, ['localityid']),
    getFeedPrecinctSplitsErrors: errorResponder(queries.v3.precinctSplitsErrors, ['precinctsplitid']),
    getFeedElectoralDistrictsErrors: errorResponder(queries.v3.electoralDistrictsErrors, ['electoraldistrictid']),
  }
}
