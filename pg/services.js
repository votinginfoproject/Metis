var pg = require("./gets.js");
var pgErrors = require("./gets_errors.js");
var csv = require('./csv.js');

function registerPostgresServices (app) {
  app.get('/db/feeds', pg.getFeeds);
  app.get('/db/feeds/:feedid/error-total-count', pg.getErrorsTotal);
  app.get('/db/feeds/:feedid/election', pg.getFeedElection);
  app.get('/db/feeds/:feedid/election/state', pg.getFeedState);
  app.get('/db/feeds/:feedid/election/state/election-administration', pg.getFeedStateElectionAdministration);
  app.get('/db/feeds/:feedid/election/state/election-administrations', pg.getFeedElectionAdministrations);
  app.get('/db/feeds/:feedid/localities', pg.getFeedLocalities);
  app.get('/db/feeds/:feedid/overview', pg.getFeedOverview);
  app.get('/db/feeds/:feedid/results', pg.getResults);
  app.get('/db/feeds/:feedid/source', pg.getFeedSource);
  app.get('/db/feeds/:feedid/validations/errorCount', pg.getValidationsErrorCount);
  app.get('/db/feeds/:feedid/earlyvotesites', pg.getFeedEarlyVoteSites);
  app.get('/db/feeds/:feedid/earlyvotesites/:earlyvotesiteid', pg.getFeedEarlyVoteSite);
  
  // Polling Location-related routes
  app.get('/db/feeds/:feedid/polling-locations/:pollinglocationid', pg.getFeedPollingLocation);
  app.get('/db/feeds/:feedid/polling-locations/:pollinglocationid/precincts', pg.getFeedPollingLocationPrecincts);
  app.get('/db/feeds/:feedid/polling-locations/:pollinglocationid/precinct-splits', pg.getFeedPollingLocationPrecinctSplits);
  
  // Contest-related routes
  app.get('/db/feeds/:feedid/contests', pg.getFeedContests);
  app.get('/db/feeds/:feedid/contests/:contestid', pg.getFeedContest);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot', pg.getFeedContestBallot);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/referendum', pg.getFeedContestBallotReferendum);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/candidates', pg.getFeedContestBallotCandidates);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/candidates/:candidateid', pg.getFeedContestBallotCandidate);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/custom-ballot', pg.getFeedContestBallotCustomBallot);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/custom-ballot-responses', pg.getFeedContestBallotCustomBallotResponses);
  app.get('/db/feeds/:feedid/contests/:contestid/contest-electoral-district', pg.getFeedContestElectoralDistrict);
  app.get('/db/feeds/:feedid/contests/:contestid/electoral-district', pg.getFeedContestElectoralDistrict);
  app.get('/db/feeds/:feedid/contests/:contestid/electoral-district/precincts', pg.getFeedContestElectoralDistrictPrecincts);
  app.get('/db/feeds/:feedid/contests/:contestid/electoral-district/precinct-splits', pg.getFeedContestElectoralDistrictPrecinctSplits);
  app.get('/db/feeds/:feedid/contests/:contestid/overview/ballot', pg.getFeedContestOverviewBallot);
  app.get('/db/feeds/:feedid/contests/:contestid/overview/referenda', pg.getFeedContestOverviewReferendum);
  app.get('/db/feeds/:feedid/contests/:contestid/overview/candidates', pg.getFeedContestOverviewCandidates);
  app.get('/db/feeds/:feedid/contests/:contestid/overview/electoral-districts', pg.getFeedContestOverviewElectoralDistrict);
  app.get('/db/feeds/:feedid/contests/overview', pg.getFeedContestsOverview);

  // Locality-related routes
  app.get('/db/feeds/:feedid/election/state/localities/:localityid', pg.getFeedLocality);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/early-vote-sites', pg.getFeedLocalityEarlyVoteSites);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/election-administration', pg.getFeedLocalityElectionAdministration);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/election-administration/election-official', pg.getFeedLocalityElectionAdministrationElectionOfficial);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/election-administration/overseas-voter-contact', pg.getFeedLocalityElectionAdministrationOverseasVoterContact);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/precincts', pg.getFeedLocalityPrecincts);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/early-vote-sites', pg.getFeedLocalityOverviewEarlyVoteSites);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/early-vote-sites/errors', pg.getFeedLocalityOverviewEarlyVoteSitesErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/election-administrations', pg.getFeedLocalityOverviewElectionAdministrations);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/election-administrations/errors', pg.getFeedLocalityOverviewElectionAdministrationsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/polling-locations', pg.getFeedLocalityOverviewPollingLocations);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/polling-locations/errors', pg.getFeedLocalityOverviewPollingLocationsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/precincts', pg.getFeedLocalityOverviewPrecincts);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/precincts/errors', pg.getFeedLocalityOverviewPrecinctsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/precinct-splits', pg.getFeedLocalityOverviewPrecinctSplits);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/precinct-splits/errors', pg.getFeedLocalityOverviewPrecinctSplitsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/street-segments', pg.getFeedLocalityOverviewStreetSegments);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/counts/street-segments/errors', pg.getFeedLocalityOverviewStreetSegmentsErrors);
  
  // Precinct-related routes
  app.get('/db/feeds/:feedid/precinct/:precinctid', pg.getFeedPrecinct);
  app.get('/db/feeds/:feedid/precinct/:precinctid/early-vote-sites', pg.getFeedPrecinctEarlyVoteSites);
  app.get('/db/feeds/:feedid/precinct/:precinctid/electoral-districts', pg.getFeedPrecinctElectoralDistricts);
  app.get('/db/feeds/:feedid/precinct/:precinctid/polling-locations', pg.getFeedPrecinctPollingLocations);
  app.get('/db/feeds/:feedid/precinct/:precinctid/precinct-splits', pg.getFeedPrecinctPrecinctSplits);
  app.get('/db/feeds/:feedid/precinct/:precinctid/street-segments', pg.getFeedPrecinctStreetSegments);
  
  // Precinct Split-related routes
  app.get('/db/feeds/:feedid/precinct-split/:precinctsplitid', pg.getFeedPrecinctSplit);
  app.get('/db/feeds/:feedid/precinct-split/:precinctsplitid/electoral-districts', pg.getFeedPrecinctSplitElectoralDistricts);
  app.get('/db/feeds/:feedid/precinct-split/:precinctsplitid/polling-locations', pg.getFeedPrecinctSplitPollingLocations);
  app.get('/db/feeds/:feedid/precinct-split/:precinctsplitid/street-segments', pg.getFeedPrecinctSplitStreetSegments);

  // Electoral District-related routes
  app.get('/db/feeds/:feedid/electoral-districts/:electoraldistrictid', pg.getFeedElectoralDistrict);
  app.get('/db/feeds/:feedid/electoral-districts/:electoraldistrictid/contest', pg.getFeedElectoralDistrictContest);
  app.get('/db/feeds/:feedid/electoral-districts/:electoraldistrictid/precincts', pg.getFeedElectoralDistrictPrecincts);
  app.get('/db/feeds/:feedid/electoral-districts/:electoraldistrictid/precinct-splits', pg.getFeedElectoralDistrictPrecinctSplits);

  // Referendum-related routes
  app.get('/db/feeds/:feedid/referendum/:referendumid', pg.getFeedReferendum);
  app.get('/db/feeds/:feedid/referendum/:referendumid/ballot-responses', pg.getFeedReferendumBallotResponses);

  // errors
  app.get('/db/feeds/:feedid/election/contests/:contestid/ballot/candidates/:candidateid/errors', pgErrors.getFeedCandidateErrors);
  app.get('/db/feeds/:feedid/election/contests/:contestid/ballot/errors', pgErrors.getFeedContestBallotErrors);
  app.get('/db/feeds/:feedid/election/contests/:contestid/errors', pgErrors.getFeedContestErrors);
  app.get('/db/feeds/:feedid/election/state/earlyvotesites/:earlyvotesiteid/errors', pgErrors.getFeedEarlyVoteSiteErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/earlyvotesites/errors', pgErrors.getFeedLocalityEarlyVoteSitesErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/electionadministrations/errors', pgErrors.getFeedLocalityElectionAdministrationsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/pollinglocations/errors', pgErrors.getFeedLocalityPollingLocationsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/precinctsplits/errors', pgErrors.getFeedLocalityPrecinctSplitsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/precincts/errors', pgErrors.getFeedLocalityPrecinctsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/streetsegments/errors', pgErrors.getFeedLocalityStreetSegmentsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:precinctsplitid/errors', pgErrors.getFeedPrecinctSplitsErrors);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/electoraldistricts/:electoraldistrictid/errors', pgErrors.getFeedElectoralDistrictsErrors);
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
  app.get('/db/feeds/:feedid/overview/precincts/errors/report', csv.scopedErrorReport("precincts"));
  app.get('/db/feeds/:feedid/overview/precinctsplits/errors/report', csv.scopedErrorReport("precinct-splits"));
  app.get('/db/feeds/:feedid/overview/referenda/errors/report', csv.scopedErrorReport("referendums"));
  app.get('/db/feeds/:feedid/overview/streetsegments/errors/report', csv.scopedErrorReport("street-segments"));
  app.get('/db/feeds/:feedid/source/errors/report', csv.scopedErrorReport("sources"));
}

exports.registerPostgresServices = registerPostgresServices;
