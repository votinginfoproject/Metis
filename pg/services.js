var pg = require("./gets.js");

function registerPostgresServices (app) {
  app.get('/db/feeds', pg.getFeeds);
  app.get('/db/feeds/:feedid/contests', pg.getFeedContests);
  app.get('/db/feeds/:feedid/contests/:contestid', pg.getFeedContest);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot', pg.getFeedContestBallot);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/referendum', pg.getFeedContestBallotReferendum);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/candidates', pg.getFeedContestBallotCandidates);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/candidates/:candidateid', pg.getFeedContestBallotCandidate);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/custom-ballot', pg.getFeedContestBallotCustomBallot);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot/custom-ballot-responses', pg.getFeedContestBallotCustomBallotResponses);
  app.get('/db/feeds/:feedid/contests/:contestid/ballot-line-results', pg.getFeedContestBallotLineResults);
  app.get('/db/feeds/:feedid/contests/:contestid/electoral-district', pg.getFeedContestElectoralDistrict);
  app.get('/db/feeds/:feedid/contests/:contestid/result', pg.getFeedContestResult);
  app.get('/db/feeds/:feedid/contests/overview', pg.getFeedContestsOverview);
  app.get('/db/feeds/:feedid/election', pg.getFeedElection);
  app.get('/db/feeds/:feedid/election/state', pg.getFeedState);
  app.get('/db/feeds/:feedid/election/state/election-administrations', pg.getFeedElectionAdministrations);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid', pg.getFeedLocality);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/early-vote-sites', pg.getFeedLocalityEarlyVoteSites);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/election-administration', pg.getFeedLocalityElectionAdministration);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/precincts', pg.getFeedLocalityPrecincts);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/early-vote-sites', pg.getFeedLocalityOverviewEarlyVoteSites);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/election-administrations', pg.getFeedLocalityOverviewElectionAdministrations);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/polling-locations', pg.getFeedLocalityOverviewPollingLocations);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/precincts', pg.getFeedLocalityOverviewPrecincts);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/precinct-splits', pg.getFeedLocalityOverviewPrecinctSplits);
  app.get('/db/feeds/:feedid/election/state/localities/:localityid/overview/street-segments', pg.getFeedLocalityOverviewStreetSegments);
  app.get('/db/feeds/:feedid/precinct/:precinctid', pg.getFeedPrecinct);
  app.get('/db/feeds/:feedid/precinct/:precinctid/early-vote-sites', pg.getFeedPrecinctEarlyVoteSites);
  app.get('/db/feeds/:feedid/precinct/:precinctid/electoral-districts', pg.getFeedPrecinctElectoralDistricts);
  app.get('/db/feeds/:feedid/precinct/:precinctid/polling-locations', pg.getFeedPrecinctPollingLocations);
  app.get('/db/feeds/:feedid/precinct/:precinctid/precinct-splits', pg.getFeedPrecinctPrecinctSplits);
  app.get('/db/feeds/:feedid/precinct/:precinctid/street-segments', pg.getFeedPrecinctStreetSegments);
  app.get('/db/feeds/:feedid/localities', pg.getFeedLocalities);
  app.get('/db/feeds/:feedid/overview', pg.getFeedOverview);
  app.get('/db/feeds/:feedid/referendum/:referendumid', pg.getFeedReferendum);
  app.get('/db/feeds/:feedid/referendum/:referendumid/ballot-responses', pg.getFeedReferendumBallotResponses);
  app.get('/db/feeds/:feedid/results', pg.getResults);
  app.get('/db/feeds/:feedid/source', pg.getFeedSource);
  app.get('/db/feeds/:feedid/validations/errorCount', pg.getValidationsErrorCount);
}

exports.registerPostgresServices = registerPostgresServices;
