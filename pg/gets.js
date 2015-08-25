var conn = require('./conn.js');
var queries = require('./queries.js');
var util = require('./util.js');
var authorization = require('../authentication/utils.js');

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
    if (authorization.isSuperAdmin(req.user)) {
      return util.simpleQueryResponder(queries.feeds)(req, res);
    } else {
      return util.simpleQueryResponder(queries.feedsForState, function(req) {
        return [authorization.stateGroupNames(req.user)];
      })(req, res);
    }
  },
  getResults: util.simpleQueryResponder(queries.results, util.paramExtractor()),
  getErrorsTotal: util.simpleQueryResponder(queries.errorsTotal, util.paramExtractor()),
  
  // Feed Contest-related queries
  getFeedContest: util.simpleQueryResponder(queries.contest, util.paramExtractor(['contestid'])),
  getFeedContestElectoralDistrict: util.simpleQueryResponder(queries.contestElectoralDistrict, util.paramExtractor(['contestid'])),
  getFeedContestBallot: util.simpleQueryResponder(queries.contestBallot, util.paramExtractor(['contestid'])),
  getFeedContestBallotReferendum: util.simpleQueryResponder(queries.contestBallotReferendum, util.paramExtractor(['contestid'])),
  getFeedContestBallotCandidate: util.simpleQueryResponder(queries.contestBallotCandidate, util.paramExtractor(['contestid','candidateid'])),
  getFeedContestBallotCandidates: util.simpleQueryResponder(queries.contestBallotCandidates, util.paramExtractor(['contestid'])),
  getFeedContestBallotCustomBallot: util.simpleQueryResponder(queries.contestBallotCustomBallot, util.paramExtractor(['contestid'])),
  getFeedContestBallotCustomBallotResponses: util.simpleQueryResponder(queries.contestBallotCustomBallotResponses, util.paramExtractor(['contestid'])),
  
  // Feed Contest Electoral District-related queries
  getFeedContestElectoralDistrict: util.simpleQueryResponder(queries.contestElectoralDistrict, util.paramExtractor(['contestid'])),
  getFeedContestElectoralDistrictPrecincts: util.simpleQueryResponder(queries.contestElectoralDistrictPrecincts, util.paramExtractor(['contestid'])),
  getFeedContestElectoralDistrictPrecinctSplits: util.simpleQueryResponder(queries.contestElectoralDistrictPrecinctSplits, util.paramExtractor(['contestid'])),
  
  // Feed Contest Overview
  getFeedContestOverviewBallot: util.simpleQueryResponder(queries.contestOverviewBallot, util.paramExtractor(['contestid'])),
  getFeedContestOverviewReferendum: util.simpleQueryResponder(queries.contestOverviewReferendum, util.paramExtractor(['contestid'])),
  getFeedContestOverviewCandidates: util.simpleQueryResponder(queries.contestOverviewCandidates, util.paramExtractor(['contestid'])),
  getFeedContestOverviewElectoralDistrict: util.simpleQueryResponder(queries.contestOverviewElectoralDistrict, util.paramExtractor(['contestid'])),
  
  // Feed Locality-related queries
  getFeedLocality: util.simpleQueryResponder(queries.locality, util.paramExtractor(['localityid'])),
  getFeedLocalityPrecincts: util.simpleQueryResponder(queries.localityPrecincts, util.paramExtractor(['localityid'])),
  getFeedLocalityEarlyVoteSites: util.simpleQueryResponder(queries.localityEarlyVoteSites, util.paramExtractor(['localityid'])),
  getFeedLocalityElectionAdministration: util.simpleQueryResponder(queries.localityElectionAdministration, util.paramExtractor(['localityid'])),
  getFeedLocalityElectionAdministrationElectionOfficial: util.simpleQueryResponder(queries.localityElectionAdministrationElectionOfficial, util.paramExtractor(['localityid'])),
  getFeedLocalityElectionAdministrationOverseasVoterContact: util.simpleQueryResponder(queries.localityElectionAdministrationOverseasVoterContact, util.paramExtractor(['localityid'])),
  getFeedLocalities: util.simpleQueryResponder(queries.localities, util.paramExtractor()),

  // Feed Locality Overview
  getFeedLocalityOverviewEarlyVoteSites: util.simpleQueryResponder(queries.localityOverviewEarlyVoteSites, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewEarlyVoteSitesErrors: util.simpleQueryResponder(queries.localityOverviewEarlyVoteSitesErrors, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewElectionAdministrations: util.simpleQueryResponder(queries.localityOverviewElectionAdministrations, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewElectionAdministrationsErrors: util.simpleQueryResponder(queries.localityOverviewElectionAdministrationsErrors, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewPollingLocations: util.simpleQueryResponder(queries.localityOverviewPollingLocations, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewPollingLocationsErrors: util.simpleQueryResponder(queries.localityOverviewPollingLocationsErrors, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewPrecinctSplits: util.simpleQueryResponder(queries.localityOverviewPrecinctSplits, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewPrecinctSplitsErrors: util.simpleQueryResponder(queries.localityOverviewPrecinctSplitsErrors, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewPrecincts: util.simpleQueryResponder(queries.localityOverviewPrecincts, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewPrecinctsErrors: util.simpleQueryResponder(queries.localityOverviewPrecinctsErrors, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewStreetSegments: util.simpleQueryResponder(queries.localityOverviewStreetSegments, util.paramExtractor(['localityid'])),
  getFeedLocalityOverviewStreetSegmentsErrors: util.simpleQueryResponder(queries.localityOverviewStreetSegmentsErrors, util.paramExtractor(['localityid'])),

  // Feed Precinct-related queries
  getFeedPrecinct: util.simpleQueryResponder(queries.precinct, util.paramExtractor(['precinctid'])),
  getFeedPrecinctEarlyVoteSites: util.simpleQueryResponder(queries.precinctEarlyVoteSites, util.paramExtractor(['precinctid'])),
  getFeedPrecinctElectoralDistricts: util.simpleQueryResponder(queries.precinctElectoralDistricts, util.paramExtractor(['precinctid'])),
  getFeedPrecinctPollingLocations: util.simpleQueryResponder(queries.precinctPollingLocations, util.paramExtractor(['precinctid'])),
  getFeedPrecinctPrecinctSplits: util.simpleQueryResponder(queries.precinctPrecinctSplits, util.paramExtractor(['precinctid'])),
  getFeedPrecinctStreetSegments: util.simpleQueryResponder(queries.precinctStreetSegments, util.paramExtractor(['precinctid'])),

  // Feed Precinct Splits-related queries
  getFeedPrecinctSplit: util.simpleQueryResponder(queries.precinctSplit, util.paramExtractor(['precinctsplitid'])),
  getFeedPrecinctSplitElectoralDistricts: util.simpleQueryResponder(queries.precinctSplitElectoralDistricts, util.paramExtractor(['precinctsplitid'])),
  getFeedPrecinctSplitPollingLocations: util.simpleQueryResponder(queries.precinctSplitPollingLocations, util.paramExtractor(['precinctsplitid'])),
  getFeedPrecinctSplitStreetSegments: util.simpleQueryResponder(queries.precinctSplitStreetSegments, util.paramExtractor(['precinctsplitid'])),

  // Feed Polling Location-related queries
  getFeedPollingLocation: util.simpleQueryResponder(queries.pollingLocation, util.paramExtractor(['pollinglocationid'])),
  getFeedPollingLocationPrecincts: util.simpleQueryResponder(queries.pollingLocationPrecincts, util.paramExtractor(['pollinglocationid'])),
  getFeedPollingLocationPrecinctSplits: util.simpleQueryResponder(queries.pollingLocationPrecinctSplits, util.paramExtractor(['pollinglocationid'])),
  
  // Feed State-related queries
  getFeedState: util.simpleQueryResponder(queries.state, util.paramExtractor()),
  getFeedStateElectionAdministration: util.simpleQueryResponder(queries.stateElectionAdministration, util.paramExtractor()),
  
  // Feed Electoral District-related queries
  getFeedElectoralDistrict: util.simpleQueryResponder(queries.electoralDistrict, util.paramExtractor(['electoraldistrictid'])),
  getFeedElectoralDistrictContest: util.simpleQueryResponder(queries.electoralDistrictContest, util.paramExtractor(['electoraldistrictid'])),
  getFeedElectoralDistrictPrecincts: util.simpleQueryResponder(queries.electoralDistrictPrecincts, util.paramExtractor(['electoraldistrictid'])),
  getFeedElectoralDistrictPrecinctSplits: util.simpleQueryResponder(queries.electoralDistrictPrecinctSplits, util.paramExtractor(['electoraldistrictid'])),

  getFeedContests: util.simpleQueryResponder(queries.contests, util.paramExtractor()),
  getFeedEarlyVoteSites: util.simpleQueryResponder(queries.earlyVoteSites, util.paramExtractor()),
  getFeedEarlyVoteSite: util.simpleQueryResponder(queries.earlyVoteSite, util.paramExtractor(['earlyvotesiteid'])),
  getFeedElectionAdministrations: util.simpleQueryResponder(queries.electionAdministrations, util.paramExtractor()),
  getFeedElection: util.simpleQueryResponder(queries.election, util.paramExtractor()),
  getFeedReferendum: util.simpleQueryResponder(queries.referendum, util.paramExtractor(['referendumid'])),
  getFeedReferendumBallotResponses: util.simpleQueryResponder(queries.referendumBallotResponses, util.paramExtractor(['referendumid'])),
  getFeedSource: util.simpleQueryResponder(queries.source, util.paramExtractor()),
  getFeedOverview: function(req, res) {
    var client = conn.openPostgres();
    var feedid = req.params.feedid;
    var query = client.query("SELECT s.* FROM statistics s INNER JOIN results r ON s.results_id = r.id WHERE r.public_id=$1", [decodeURIComponent(feedid)]);

    query.on("row", function (row, result) {
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
        election: overviewTableRow(row, 'Election', 'elections', '#/feeds/' + feedid + '/election/errors')
      };
      result.addRow(tables);
    });

    conn.closePostgres(query, client, res);
  },
  getFeedContestsOverview: function(req, res) {
    var client = conn.openPostgres();
    var feedid = req.params.feedid;
    var query = client.query("SELECT s.ballots_count, s.ballots_error_count, s.ballots_completion, s.candidates_count, s.candidates_error_count, s.candidates_completion, s.contests_count, s.contests_error_count, s.contests_completion, s.electoral_districts_count, s.electoral_districts_error_count, s.electoral_districts_completion, s.referendums_count, s.referendums_error_count, s.referendums_completion FROM statistics s INNER JOIN results r ON s.results_id = r.id WHERE r.public_id=$1", [decodeURIComponent(feedid)]);

    query.on("row", function (row, result) {
      var tableData = [
        overviewTableRow(row, 'Ballots', 'ballots', '#/feeds/' + feedid + '/overview/ballots/errors'),
        overviewTableRow(row, 'Candidates', 'candidates', '#/feeds/' + feedid + '/overview/candidates/errors'),
        overviewTableRow(row, 'Contests', 'contests', '#/feeds/' + feedid + '/election/contests/errors'),
        overviewTableRow(row, 'Electoral Districts', 'electoral_districts', '#/feeds/' + feedid + '/overview/electoraldistricts/errors'),
        overviewTableRow(row, 'Referenda', 'referendums', '#/feeds/' + feedid + '/overview/referenda/errors')
      ];
      result.addRow(tableData);
    });

    conn.closePostgres(query, client, res);
  },
  getValidationsErrorCount: util.simpleQueryResponder("SELECT COUNT(*) AS errorcount FROM validations v INNER JOIN results r ON r.id = v.results_id WHERE r.public_id = $1", function(req) { return [decodeURIComponent(req.params.feedid)]; })
}
