var pg = require("./gets.js");
var pg51 = require("./v5_1_queries.js");
var pgErrors = require("./gets_errors.js");
var csv = require('./csv.js');

function registerPostgresServices (app) {
  ///////// Version-agnostic /////////
  app.get('/db/feeds', pg.getFeeds);
  app.get('/db/feeds/:feedid/error-total-count', pg.getErrorsTotal);
  app.get('/db/feeds/:feedid/approvable-status', pg.getApprovableStatus);
  app.post('/db/feeds/:feedid/approve', pg.approveFeed);
  app.get('/db/feeds/:feedid/results', pg.getResults);
  app.get('/db/feeds/:feedid/overview', pg.getFeedOverview);

  // errors
  app.get('/db/feeds/:feedid/election/errors', pgErrors.overviewErrors("elections"));
  app.get('/db/feeds/:feedid/errors', pgErrors.getFeedErrors);
  app.get('/db/feeds/:feedid/overview/ballots/errors', pgErrors.overviewErrors("ballots"));
  app.get('/db/feeds/:feedid/overview/candidates/errors', pgErrors.overviewErrors("candidates"));
  app.get('/db/feeds/:feedid/overview/contests/errors', pgErrors.overviewErrors("contests"));
  app.get('/db/feeds/:feedid/overview/earlyvotesites/errors', pgErrors.overviewErrors("early-vote-sites"));
  app.get('/db/feeds/:feedid/overview/electionadministrations/errors', pgErrors.overviewErrors("election-administrations"));
  app.get('/db/feeds/:feedid/overview/electionofficials/errors', pgErrors.overviewErrors("election-officials"));
  app.get('/db/feeds/:feedid/overview/electoraldistricts/errors', pgErrors.overviewErrors("electoral-districts"));
  app.get('/db/feeds/:feedid/overview/localities/errors', pgErrors.overviewErrors("localities"));
  app.get('/db/feeds/:feedid/overview/pollinglocations/errors', pgErrors.overviewErrors("polling-locations"));
  app.get('/db/feeds/:feedid/overview/precincts/errors', pgErrors.overviewErrors("precincts"));
  app.get('/db/feeds/:feedid/overview/precinctsplits/errors', pgErrors.overviewErrors("precinct-splits"));
  app.get('/db/feeds/:feedid/overview/referenda/errors', pgErrors.overviewErrors("referendums"));
  app.get('/db/feeds/:feedid/overview/streetsegments/errors', pgErrors.overviewErrors("street-segments"));
  app.get('/db/feeds/:feedid/source/errors', pgErrors.overviewErrors("sources"));

  // csv
  app.get('/db/feeds/:feedid/errors/report', csv.fullErrorReport);
  app.get('/db/feeds/:feedid/overview/ballots/errors/report', csv.scopedErrorReport("ballots"));
  app.get('/db/feeds/:feedid/overview/candidates/errors/report', csv.scopedErrorReport("candidates"));
  app.get('/db/feeds/:feedid/overview/contests/errors/report', csv.scopedErrorReport("contests"));
  app.get('/db/feeds/:feedid/overview/earlyvotesites/errors/report', csv.scopedErrorReport("early-vote-sites"));
  app.get('/db/feeds/:feedid/overview/electionadministrations/errors/report', csv.scopedErrorReport("election-administrations"));
  app.get('/db/feeds/:feedid/overview/electionofficials/errors/report', csv.scopedErrorReport("election-officials"));
  app.get('/db/feeds/:feedid/overview/electoraldistricts/errors/report', csv.scopedErrorReport("electoral-districts"));
  app.get('/db/feeds/:feedid/overview/localities/errors/report', csv.scopedErrorReport("localities"));
  app.get('/db/feeds/:feedid/overview/pollinglocations/errors/report', csv.scopedErrorReport("polling-locations"));
  app.get('/db/feeds/:feedid/overview/pollinglocations/errors/address/report', csv.pollingLocationAddressReport);
  app.get('/db/feeds/:feedid/overview/precincts/errors/report', csv.scopedErrorReport("precincts"));
  app.get('/db/feeds/:feedid/overview/precinctsplits/errors/report', csv.scopedErrorReport("precinct-splits"));
  app.get('/db/feeds/:feedid/overview/referenda/errors/report', csv.scopedErrorReport("referendums"));
  app.get('/db/feeds/:feedid/overview/streetsegments/errors/report', csv.scopedErrorReport("street-segments"));
  app.get('/db/feeds/:feedid/source/errors/report', csv.scopedErrorReport("sources"));

  ///////// Version 5.1 /////////
  app.get('/db/feeds/:feedid/xml/overview', pg51.feedOverview);
  app.get('/db/feeds/:feedid/xml/overview-summary', pg51.feedOverviewSummaryData);

  // Voting locations
  app.get('/db/5.1/feeds/:feedid/overview/street_segments/errors', pg51.overviewErrors("StreetSegment"));
  app.get('/db/5.1/feeds/:feedid/overview/state/errors', pg51.overviewErrors("State"));
  app.get('/db/5.1/feeds/:feedid/overview/precincts/errors', pg51.overviewErrors("Precinct"));
  app.get('/db/5.1/feeds/:feedid/overview/polling_locations/errors', pg51.overviewErrors("PollingLocation"));
  app.get('/db/5.1/feeds/:feedid/overview/localities/errors', pg51.overviewErrors("Locality"));
  app.get('/db/5.1/feeds/:feedid/overview/hours_open/errors', pg51.overviewErrors("HoursOpen"));

  // Localities
  app.get('/db/5.1/feeds/:feedid/localities', pg51.localityOverview);
  app.get('/db/5.1/feeds/:publicId/election/state/localities/:localityId', pg51.localityDetail);
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/precincts/errors', pg51.scopedLocalityErrors("Precinct"));
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/street_segments/errors', pg51.scopedLocalityErrors("StreetSegment"));
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/polling_locations/errors', pg51.scopedLocalityErrors("PollingLocation"));
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/election_administrations/errors', pg51.scopedLocalityErrors("ElectionAdministration"));
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/departments/errors', pg51.scopedLocalityErrors("Department"));
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/voter_services/errors', pg51.scopedLocalityErrors("VoterService"));
  app.get('/db/5.1/feeds/:feedid/election/state/localities/:localityId/errors', csv.xmlTreeLocalityErrorReport);

  // Voter Resources
  app.get('/db/5.1/feeds/:feedid/overview/election_administrations/errors', pg51.overviewErrors("ElectionAdministration"));
  app.get('/db/5.1/feeds/:feedid/overview/departments/errors', pg51.overviewErrors("Department"));
  app.get('/db/5.1/feeds/:feedid/overview/voter_services/errors', pg51.overviewErrors("VoterService"));

  // Contests table
  app.get('/db/5.1/feeds/:feedid/overview/candidate_contests/errors', pg51.overviewErrors("CandidateContest"));
  app.get('/db/5.1/feeds/:feedid/overview/candidate_selection/errors', pg51.overviewErrors("CandidateSelection"));
  app.get('/db/5.1/feeds/:feedid/overview/ballot_measure_contests/errors', pg51.overviewErrors("BallotMeasureContest"));
  app.get('/db/5.1/feeds/:feedid/overview/ballot_selections/errors', pg51.overviewErrors("BallotSelection"));
  app.get('/db/5.1/feeds/:feedid/overview/retention_contests/errors', pg51.overviewErrors("RetentionContest"));
  app.get('/db/5.1/feeds/:feedid/overview/party_contests/errors', pg51.overviewErrors("PartyContest"));
  app.get('/db/5.1/feeds/:feedid/overview/electoral_districts/errors', pg51.overviewErrors("ElectoralDistrict"));
  app.get('/db/5.1/feeds/:feedid/overview/candidates/errors', pg51.overviewErrors("Candidate"));
  app.get('/db/5.1/feeds/:feedid/overview/offices/errors', pg51.overviewErrors("Office"));

  // Source & Elections table
  app.get('/db/5.1/feeds/:feedid/overview/source/errors', pg51.overviewErrors("Source"));
  app.get('/db/5.1/feeds/:feedid/overview/election/errors', pg51.overviewErrors("Election"));

  app.get('/db/5.1/feeds/:feedid/source', pg51.source);
  app.get('/db/5.1/feeds/:feedid/election', pg51.election);

  app.get('/db/feeds/:feedid/xml/errors/report', csv.xmlTreeValidationErrorReport);
  app.get('/db/feeds/:feedid/xml/errors/candidate_selection/report', csv.scopedXmlTreeValidationErrorReport('CandidateSelection'));
  app.get('/db/feeds/:feedid/xml/errors/ballot_measure_contests/report', csv.scopedXmlTreeValidationErrorReport('BallotMeasureContest'));
  app.get('/db/feeds/:feedid/xml/errors/ballot_selection/report', csv.scopedXmlTreeValidationErrorReport('BallotSelection'));
  app.get('/db/feeds/:feedid/xml/errors/retention_contests/report', csv.scopedXmlTreeValidationErrorReport('RetentionContest'));
  app.get('/db/feeds/:feedid/xml/errors/party_contests/report', csv.scopedXmlTreeValidationErrorReport('PartyContest'));
  app.get('/db/feeds/:feedid/xml/errors/electoral_districts/report', csv.scopedXmlTreeValidationErrorReport('ElectoralDistrict'));
  app.get('/db/feeds/:feedid/xml/errors/candidates/report', csv.scopedXmlTreeValidationErrorReport('Candidate'));
  app.get('/db/feeds/:feedid/xml/errors/candidate_contests/report', csv.scopedXmlTreeValidationErrorReport('CandidateContest'));
  app.get('/db/feeds/:feedid/xml/errors/offices/report', csv.scopedXmlTreeValidationErrorReport('Office'));
  app.get('/db/feeds/:feedid/xml/errors/source_election/report',
          csv.scopedXmlTreeValidationErrorReport('Source', 'Election'));
  app.get('/db/feeds/:feedid/xml/errors/street_segments/report',
          csv.scopedXmlTreeValidationErrorReport('StreetSegment'));
  app.get('/db/feeds/:feedid/xml/errors/state/report',
          csv.scopedXmlTreeValidationErrorReport('State'));
  app.get('/db/feeds/:feedid/xml/errors/precincts/report',
          csv.scopedXmlTreeValidationErrorReport('Precincts'));
  app.get('/db/feeds/:feedid/xml/errors/polling_locations/report',
          csv.scopedXmlTreeValidationErrorReport('PollingLocation'));
  app.get('/db/feeds/:feedid/xml/errors/localities/report',
          csv.scopedXmlTreeValidationErrorReport('Locality'));
  app.get('/db/feeds/:feedid/xml/errors/hours_open/report',
          csv.scopedXmlTreeValidationErrorReport('HoursOpen'));
  app.get('/db/feeds/:feedid/xml/errors/election_administration/report',
          csv.scopedXmlTreeValidationErrorReport('ElectionAdministration'));
  app.get('/db/feeds/:feedid/xml/errors/departments/report',
          csv.scopedXmlTreeValidationErrorReport('Departments'));
  app.get('/db/feeds/:feedid/xml/errors/voter_services/report',
          csv.scopedXmlTreeValidationErrorReport('VoterService'));
  app.get('/db/feeds/:feedid/xml/error-total-count', pg51.totalErrors);
  app.get('/db/feeds/:feedid/xml/errors/summary', pg51.errorSummary);

  ///////// Version 3.0 /////////
  app.get('/db/v3/feeds/:feedid/election', pg.v3.getFeedElection);
  app.get('/db/v3/feeds/:feedid/election/state', pg.v3.getFeedState);
  app.get('/db/v3/feeds/:feedid/election/state/election-administration', pg.v3.getFeedStateElectionAdministration);
  app.get('/db/v3/feeds/:feedid/election/state/election-administrations', pg.v3.getFeedElectionAdministrations);
  app.get('/db/v3/feeds/:feedid/localities', pg.v3.getFeedLocalities);
  app.get('/db/v3/feeds/:feedid/source', pg.v3.getFeedSource);
  app.get('/db/v3/feeds/:feedid/validations/errorCount', pg.v3.getValidationsErrorCount);
  app.get('/db/v3/feeds/:feedid/earlyvotesites', pg.v3.getFeedEarlyVoteSites);
  app.get('/db/v3/feeds/:feedid/earlyvotesites/:earlyvotesiteid', pg.v3.getFeedEarlyVoteSite);

  // Polling Location-related routes
  app.get('/db/v3/feeds/:feedid/polling-locations/:pollinglocationid', pg.v3.getFeedPollingLocation);
  app.get('/db/v3/feeds/:feedid/polling-locations/:pollinglocationid/precincts', pg.v3.getFeedPollingLocationPrecincts);
  app.get('/db/v3/feeds/:feedid/polling-locations/:pollinglocationid/precinct-splits', pg.v3.getFeedPollingLocationPrecinctSplits);

  // Contest-related routes
  app.get('/db/v3/feeds/:feedid/contests', pg.v3.getFeedContests);
  app.get('/db/v3/feeds/:feedid/contests/:contestid', pg.v3.getFeedContest);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/ballot', pg.v3.getFeedContestBallot);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/ballot/referendum', pg.v3.getFeedContestBallotReferendum);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/ballot/candidates', pg.v3.getFeedContestBallotCandidates);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/ballot/candidates/:candidateid', pg.v3.getFeedContestBallotCandidate);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/ballot/custom-ballot', pg.v3.getFeedContestBallotCustomBallot);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/ballot/custom-ballot-responses', pg.v3.getFeedContestBallotCustomBallotResponses);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/contest-electoral-district', pg.v3.getFeedContestElectoralDistrict);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/electoral-district', pg.v3.getFeedContestElectoralDistrict);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/electoral-district/precincts', pg.v3.getFeedContestElectoralDistrictPrecincts);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/electoral-district/precinct-splits', pg.v3.getFeedContestElectoralDistrictPrecinctSplits);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/overview/ballot', pg.v3.getFeedContestOverviewBallot);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/overview/referenda', pg.v3.getFeedContestOverviewReferendum);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/overview/candidates', pg.v3.getFeedContestOverviewCandidates);
  app.get('/db/v3/feeds/:feedid/contests/:contestid/overview/electoral-districts', pg.v3.getFeedContestOverviewElectoralDistrict);
  app.get('/db/v3/feeds/:feedid/contests/overview', pg.v3.getFeedContestsOverview);

  // Locality-related routes
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid', pg.v3.getFeedLocality);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/early-vote-sites', pg.v3.getFeedLocalityEarlyVoteSites);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/election-administration', pg.v3.getFeedLocalityElectionAdministration);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/election-administration/election-official', pg.v3.getFeedLocalityElectionAdministrationElectionOfficial);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/election-administration/overseas-voter-contact', pg.v3.getFeedLocalityElectionAdministrationOverseasVoterContact);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/precincts', pg.v3.getFeedLocalityPrecincts);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/early-vote-sites', pg.v3.getFeedLocalityOverviewEarlyVoteSites);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/early-vote-sites/errors', pg.v3.getFeedLocalityOverviewEarlyVoteSitesErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/election-administrations', pg.v3.getFeedLocalityOverviewElectionAdministrations);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/election-administrations/errors', pg.v3.getFeedLocalityOverviewElectionAdministrationsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/polling-locations', pg.v3.getFeedLocalityOverviewPollingLocations);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/polling-locations/errors', pg.v3.getFeedLocalityOverviewPollingLocationsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/precincts', pg.v3.getFeedLocalityOverviewPrecincts);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/precincts/errors', pg.v3.getFeedLocalityOverviewPrecinctsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/precinct-splits', pg.v3.getFeedLocalityOverviewPrecinctSplits);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/precinct-splits/errors', pg.v3.getFeedLocalityOverviewPrecinctSplitsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/street-segments', pg.v3.getFeedLocalityOverviewStreetSegments);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/counts/street-segments/errors', pg.v3.getFeedLocalityOverviewStreetSegmentsErrors);

  // Precinct-related routes
  app.get('/db/v3/feeds/:feedid/precinct/:precinctid', pg.v3.getFeedPrecinct);
  app.get('/db/v3/feeds/:feedid/precinct/:precinctid/early-vote-sites', pg.v3.getFeedPrecinctEarlyVoteSites);
  app.get('/db/v3/feeds/:feedid/precinct/:precinctid/electoral-districts', pg.v3.getFeedPrecinctElectoralDistricts);
  app.get('/db/v3/feeds/:feedid/precinct/:precinctid/polling-locations', pg.v3.getFeedPrecinctPollingLocations);
  app.get('/db/v3/feeds/:feedid/precinct/:precinctid/precinct-splits', pg.v3.getFeedPrecinctPrecinctSplits);
  app.get('/db/v3/feeds/:feedid/precinct/:precinctid/street-segments', pg.v3.getFeedPrecinctStreetSegments);

  // Precinct Split-related routes
  app.get('/db/v3/feeds/:feedid/precinct-split/:precinctsplitid', pg.v3.getFeedPrecinctSplit);
  app.get('/db/v3/feeds/:feedid/precinct-split/:precinctsplitid/electoral-districts', pg.v3.getFeedPrecinctSplitElectoralDistricts);
  app.get('/db/v3/feeds/:feedid/precinct-split/:precinctsplitid/polling-locations', pg.v3.getFeedPrecinctSplitPollingLocations);
  app.get('/db/v3/feeds/:feedid/precinct-split/:precinctsplitid/street-segments', pg.v3.getFeedPrecinctSplitStreetSegments);

  // Electoral District-related routes
  app.get('/db/v3/feeds/:feedid/electoral-districts/:electoraldistrictid', pg.v3.getFeedElectoralDistrict);
  app.get('/db/v3/feeds/:feedid/electoral-districts/:electoraldistrictid/contest', pg.v3.getFeedElectoralDistrictContest);
  app.get('/db/v3/feeds/:feedid/electoral-districts/:electoraldistrictid/precincts', pg.v3.getFeedElectoralDistrictPrecincts);
  app.get('/db/v3/feeds/:feedid/electoral-districts/:electoraldistrictid/precinct-splits', pg.v3.getFeedElectoralDistrictPrecinctSplits);

  // Referendum-related routes
  app.get('/db/v3/feeds/:feedid/referendum/:referendumid', pg.v3.getFeedReferendum);
  app.get('/db/v3/feeds/:feedid/referendum/:referendumid/ballot-responses', pg.v3.getFeedReferendumBallotResponses);

  // errors
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/ballot/candidates/:candidateid/errors', pgErrors.v3.getFeedCandidateErrors);
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/ballot/errors', pgErrors.v3.getFeedContestBallotErrors);
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/overview/ballot/errors', pgErrors.v3.getFeedContestBallotErrors);
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/overview/candidates/errors', pgErrors.v3.getFeedContestCandidatesErrors);
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/overview/electoraldistrict/errors', pgErrors.v3.getFeedContestElectoralDistrictErrors);
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/overview/referenda/errors', pgErrors.v3.getFeedContestReferendaErrors);
  app.get('/db/v3/feeds/:feedid/election/contests/:contestid/errors', pgErrors.v3.getFeedContestErrors);
  app.get('/db/v3/feeds/:feedid/election/state/earlyvotesites/:earlyvotesiteid/errors', pgErrors.v3.getFeedEarlyVoteSiteErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/earlyvotesites/errors', pgErrors.v3.getFeedLocalityEarlyVoteSitesErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/electionadministrations/errors', pgErrors.v3.getFeedLocalityElectionAdministrationsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/pollinglocations/errors', pgErrors.v3.getFeedLocalityPollingLocationsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/precinctsplits/errors', pgErrors.v3.getFeedLocalityPrecinctSplitsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/precincts/errors', pgErrors.v3.getFeedLocalityPrecinctsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments/errors', pgErrors.v3.getFeedPrecinctStreetSegmentsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/overview/streetsegments/errors', pgErrors.v3.getFeedLocalityStreetSegmentsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:precinctsplitid/errors', pgErrors.v3.getFeedPrecinctSplitsErrors);
  app.get('/db/v3/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/electoraldistricts/:electoraldistrictid/errors', pgErrors.v3.getFeedElectoralDistrictsErrors);
}

exports.registerPostgresServices = registerPostgresServices;
