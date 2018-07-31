var conn = require('./conn.js');
var queries = require('./queries.js');
var util = require('./util.js');
var resp = require('./response.js');
var auth = require('../authentication/services.js');

var overviewTableRow = function(row, type, dbTable, link) {
  return {element_type: type,
          count: row[dbTable + '_count'],
          complete_pct: row[dbTable + '_completion'],
          error_count: row[dbTable + '_error_count'],
          link: link};
}

module.exports = {
  // Functions below return arrays for the various queries with the requirement of an ID.
  getFeeds: function(req, res) {
		var roles = auth.getUserRoles(req);
    if (auth.isSuperAdmin(req)){
      return util.simpleQueryResponder(queries.feeds, function(req) {
        return [req.query.page];
      })(req, res);
    } else {
      return util.simpleQueryResponder(queries.feedsForFipsCodes, function(req) {
        var fipsCodes = auth.getUserFipsCodes(req);
        likeFipsCodes = fipsCodes.map(function (code) { return code + "%"});
        return [likeFipsCodes, req.query.page];
      })(req, res);
    }
  },
  getResults: util.simpleQueryResponder(queries.results, util.paramExtractor()),
  getErrorsTotal: util.simpleQueryResponder(queries.errorsTotal, util.paramExtractor()),
  getApprovableStatus: util.simpleQueryResponder(queries.approvableStatus, util.paramExtractor()),
  approveFeed: util.simpleQueryResponder(queries.approveFeed, util.paramExtractor()),

  getFeedOverview: function(req, res) {
    var feedid = req.params.feedid;
    conn.query(function(client) {
      client.query("SELECT s.* FROM statistics s INNER JOIN results r ON s.results_id = r.id WHERE r.public_id=$1",
                   [decodeURIComponent(feedid)],
                   function(err, result) {
                     var row = result.rows[0]; // there is only one!
                     if (row !== undefined){
                       var tables = {
                         pollingLocations: [
                           overviewTableRow(row, 'Early Vote Sites', 'early_vote_sites', '#/feeds/' + feedid + '/overview/earlyvotesites/errors'),
                           overviewTableRow(row, 'Election Administrations', 'election_administrations', '#/feeds/' + feedid + '/overview/electionadministrations/errors'),
                           overviewTableRow(row, 'Election Officials', 'election_officials', '#/feeds/' + feedid + '/overview/electionofficials/errors'),
                           overviewTableRow(row, 'Localities', 'localities', '#/feeds/' + feedid + '/overview/localities/errors'),
                           overviewTableRow(row, 'Polling Locations', 'polling_locations', '#/feeds/' + feedid + '/overview/pollinglocations/errors'),
                           overviewTableRow(row, 'Precinct Splits', 'precinct_splits', '#/feeds/' + feedid + '/overview/precinctsplits/errors'),
                           overviewTableRow(row, 'Precincts', 'precincts', '#/feeds/' + feedid + '/overview/precincts/errors'),
                           overviewTableRow(row, 'Street Segments', 'street_segments', '#/feeds/' + feedid + '/overview/streetsegments/errors')
                         ],
                         contests: [
                           overviewTableRow(row, 'Ballots', 'ballots', '#/feeds/' + feedid + '/overview/ballots/errors'),
                           overviewTableRow(row, 'Candidates', 'candidates', '#/feeds/' + feedid + '/overview/candidates/errors'),
                           overviewTableRow(row, 'Contests', 'contests', '#/feeds/' + feedid + '/overview/contests/errors'),
                           overviewTableRow(row, 'Electoral Districts', 'electoral_districts', '#/feeds/' + feedid + '/overview/electoraldistricts/errors'),
                           overviewTableRow(row, 'Referenda', 'referendums', '#/feeds/' + feedid + '/overview/referenda/errors')
                         ],
                         source: overviewTableRow(row, 'Source', 'sources', '#/feeds/' + feedid + '/source/errors'),
                         election: overviewTableRow(row, 'Election', 'elections', '#/feeds/' + feedid + '/election/errors')}
                       } else {
                         var tables = {
                           pollingLocations: [],
                           contests: [],
                           source: {},
                           election: {}
                         }
                       };
                     resp.writeResponse([tables], res);
                   });
    });
  },
  v3: {
    getFeedContestsOverview: function(req, res) {
      var feedid = req.params.feedid;
      conn.query(function(client) {
        client.query("SELECT s.ballots_count, s.ballots_error_count, s.ballots_completion, s.candidates_count, s.candidates_error_count, s.candidates_completion, s.contests_count, s.contests_error_count, s.contests_completion, s.electoral_districts_count, s.electoral_districts_error_count, s.electoral_districts_completion, s.referendums_count, s.referendums_error_count, s.referendums_completion FROM statistics s INNER JOIN results r ON s.results_id = r.id WHERE r.public_id=$1",
                     [decodeURIComponent(feedid)],
                     function(err, result) {
                       var row = result.rows[0]; // there is only one!
                       var tableData = [
                         overviewTableRow(row, 'Ballots', 'ballots', '#/feeds/' + feedid + '/overview/ballots/errors'),
                         overviewTableRow(row, 'Candidates', 'candidates', '#/feeds/' + feedid + '/overview/candidates/errors'),
                         overviewTableRow(row, 'Contests', 'contests', '#/feeds/' + feedid + '/election/contests/errors'),
                         overviewTableRow(row, 'Electoral Districts', 'electoral_districts', '#/feeds/' + feedid + '/overview/electoraldistrict/errors'),
                         overviewTableRow(row, 'Referenda', 'referendums', '#/feeds/' + feedid + '/overview/referenda/errors')
                       ];
                       resp.writeResponse(tableData, res);
                     });
      });
    },

    getFeedContest: util.simpleQueryResponder(queries.v3.contest, util.paramExtractor(['contestid'])),
    getFeedContestBallot: util.simpleQueryResponder(queries.v3.contestBallot, util.paramExtractor(['contestid'])),
    getFeedContestBallotCandidate: util.simpleQueryResponder(queries.v3.contestBallotCandidate, util.paramExtractor(['contestid','candidateid'])),
    getFeedContestBallotCandidates: util.simpleQueryResponder(queries.v3.contestBallotCandidates, util.paramExtractor(['contestid'])),
    getFeedContestBallotCustomBallot: util.simpleQueryResponder(queries.v3.contestBallotCustomBallot, util.paramExtractor(['contestid'])),
    getFeedContestBallotCustomBallotResponses: util.simpleQueryResponder(queries.v3.contestBallotCustomBallotResponses, util.paramExtractor(['contestid'])),
    getFeedContestBallotReferendum: util.simpleQueryResponder(queries.v3.contestBallotReferendum, util.paramExtractor(['contestid'])),
    getFeedContestElectoralDistrict: util.simpleQueryResponder(queries.v3.contestElectoralDistrict, util.paramExtractor(['contestid'])),
    getFeedContestElectoralDistrictPrecinctSplits: util.simpleQueryResponder(queries.v3.contestElectoralDistrictPrecinctSplits, util.paramExtractor(['contestid'])),
    getFeedContestOverviewBallot: util.simpleQueryResponder(queries.v3.contestOverviewBallot, util.paramExtractor(['contestid'])),
    getFeedContestElectoralDistrictPrecincts: util.simpleQueryResponder(queries.v3.contestElectoralDistrictPrecincts, util.paramExtractor(['contestid'])),
    getFeedContestOverviewCandidates: util.simpleQueryResponder(queries.v3.contestOverviewCandidates, util.paramExtractor(['contestid'])),
    getFeedContestOverviewElectoralDistrict: util.simpleQueryResponder(queries.v3.contestOverviewElectoralDistrict, util.paramExtractor(['contestid'])),
    getFeedContestOverviewReferendum: util.simpleQueryResponder(queries.v3.contestOverviewReferendum, util.paramExtractor(['contestid'])),
    getFeedContests: util.simpleQueryResponder(queries.v3.contests, util.paramExtractor()),
    getFeedEarlyVoteSite: util.simpleQueryResponder(queries.v3.earlyVoteSite, util.paramExtractor(['earlyvotesiteid'])),
    getFeedEarlyVoteSites: util.simpleQueryResponder(queries.v3.earlyVoteSites, util.paramExtractor()),
    getFeedElection: util.simpleQueryResponder(queries.v3.election, util.paramExtractor()),
    getFeedElectionAdministrations: util.simpleQueryResponder(queries.v3.electionAdministrations, util.paramExtractor()),
    getFeedElectoralDistrict: util.simpleQueryResponder(queries.v3.electoralDistrict, util.paramExtractor(['electoraldistrictid'])),
    getFeedElectoralDistrictContest: util.simpleQueryResponder(queries.v3.electoralDistrictContest, util.paramExtractor(['electoraldistrictid'])),
    getFeedElectoralDistrictPrecinctSplits: util.simpleQueryResponder(queries.v3.electoralDistrictPrecinctSplits, util.paramExtractor(['electoraldistrictid'])),
    getFeedElectoralDistrictPrecincts: util.simpleQueryResponder(queries.v3.electoralDistrictPrecincts, util.paramExtractor(['electoraldistrictid'])),
    getFeedLocalities: util.simpleQueryResponder(queries.v3.localities, util.paramExtractor()),
    getFeedLocality: util.simpleQueryResponder(queries.v3.locality, util.paramExtractor(['localityid'])),
    getFeedLocalityEarlyVoteSites: util.simpleQueryResponder(queries.v3.localityEarlyVoteSites, util.paramExtractor(['localityid'])),
    getFeedLocalityElectionAdministration: util.simpleQueryResponder(queries.v3.localityElectionAdministration, util.paramExtractor(['localityid'])),
    getFeedLocalityElectionAdministrationElectionOfficial: util.simpleQueryResponder(queries.v3.localityElectionAdministrationElectionOfficial, util.paramExtractor(['localityid'])),
    getFeedLocalityElectionAdministrationOverseasVoterContact: util.simpleQueryResponder(queries.v3.localityElectionAdministrationOverseasVoterContact, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewEarlyVoteSites: util.simpleQueryResponder(queries.v3.localityOverviewEarlyVoteSites, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewEarlyVoteSitesErrors: util.simpleQueryResponder(queries.v3.localityOverviewEarlyVoteSitesErrors, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewElectionAdministrations: util.simpleQueryResponder(queries.v3.localityOverviewElectionAdministrations, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewElectionAdministrationsErrors: util.simpleQueryResponder(queries.v3.localityOverviewElectionAdministrationsErrors, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewPollingLocations: util.simpleQueryResponder(queries.v3.localityOverviewPollingLocations, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewPollingLocationsErrors: util.simpleQueryResponder(queries.v3.localityOverviewPollingLocationsErrors, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewPrecinctSplits: util.simpleQueryResponder(queries.v3.localityOverviewPrecinctSplits, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewPrecinctSplitsErrors: util.simpleQueryResponder(queries.v3.localityOverviewPrecinctSplitsErrors, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewPrecincts: util.simpleQueryResponder(queries.v3.localityOverviewPrecincts, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewPrecinctsErrors: util.simpleQueryResponder(queries.v3.localityOverviewPrecinctsErrors, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewStreetSegments: util.simpleQueryResponder(queries.v3.localityOverviewStreetSegments, util.paramExtractor(['localityid'])),
    getFeedLocalityOverviewStreetSegmentsErrors: util.simpleQueryResponder(queries.v3.localityOverviewStreetSegmentsErrors, util.paramExtractor(['localityid'])),
    getFeedLocalityPrecincts: util.simpleQueryResponder(queries.v3.localityPrecincts, util.paramExtractor(['localityid'])),
    getFeedPollingLocation: util.simpleQueryResponder(queries.v3.pollingLocation, util.paramExtractor(['pollinglocationid'])),
    getFeedPollingLocationPrecinctSplits: util.simpleQueryResponder(queries.v3.pollingLocationPrecinctSplits, util.paramExtractor(['pollinglocationid'])),
    getFeedPollingLocationPrecincts: util.simpleQueryResponder(queries.v3.pollingLocationPrecincts, util.paramExtractor(['pollinglocationid'])),
    getFeedPrecinct: util.simpleQueryResponder(queries.v3.precinct, util.paramExtractor(['precinctid'])),
    getFeedPrecinctEarlyVoteSites: util.simpleQueryResponder(queries.v3.precinctEarlyVoteSites, util.paramExtractor(['precinctid'])),
    getFeedPrecinctElectoralDistricts: util.simpleQueryResponder(queries.v3.precinctElectoralDistricts, util.paramExtractor(['precinctid'])),
    getFeedPrecinctPollingLocations: util.simpleQueryResponder(queries.v3.precinctPollingLocations, util.paramExtractor(['precinctid'])),
    getFeedPrecinctPrecinctSplits: util.simpleQueryResponder(queries.v3.precinctPrecinctSplits, util.paramExtractor(['precinctid'])),
    getFeedPrecinctSplit: util.simpleQueryResponder(queries.v3.precinctSplit, util.paramExtractor(['precinctsplitid'])),
    getFeedPrecinctSplitElectoralDistricts: util.simpleQueryResponder(queries.v3.precinctSplitElectoralDistricts, util.paramExtractor(['precinctsplitid'])),
    getFeedPrecinctSplitPollingLocations: util.simpleQueryResponder(queries.v3.precinctSplitPollingLocations, util.paramExtractor(['precinctsplitid'])),
    getFeedPrecinctSplitStreetSegments: util.simpleQueryResponder(queries.v3.precinctSplitStreetSegments, util.paramExtractor(['precinctsplitid'])),
    getFeedPrecinctStreetSegments: util.simpleQueryResponder(queries.v3.precinctStreetSegments, util.paramExtractor(['precinctid'])),
    getFeedReferendum: util.simpleQueryResponder(queries.v3.referendum, util.paramExtractor(['referendumid'])),
    getFeedReferendumBallotResponses: util.simpleQueryResponder(queries.v3.referendumBallotResponses, util.paramExtractor(['referendumid'])),
    getFeedSource: util.simpleQueryResponder(queries.v3.source, util.paramExtractor()),
    getFeedState: util.simpleQueryResponder(queries.v3.state, util.paramExtractor()),
    getFeedStateElectionAdministration: util.simpleQueryResponder(queries.v3.stateElectionAdministration, util.paramExtractor()),
    getValidationsErrorCount: util.simpleQueryResponder("SELECT COUNT(*) AS errorcount FROM validations v INNER JOIN results r ON r.id = v.results_id WHERE r.public_id = $1", function(req) { return [decodeURIComponent(req.params.feedid)]; }),
 }
}
