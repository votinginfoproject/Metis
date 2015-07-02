var pg = require("./gets.js");
var pgErrors = require("./gets_errors.js");
var csv = require('./csv.js');

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
  app.get('/db/feeds/:feedid/localities', pg.getFeedLocalities);
  app.get('/db/feeds/:feedid/overview', pg.getFeedOverview);
  app.get('/db/feeds/:feedid/referendum/:referendumid', pg.getFeedReferendum);
  app.get('/db/feeds/:feedid/referendum/:referendumid/ballot-responses', pg.getFeedReferendumBallotResponses);
  app.get('/db/feeds/:feedid/results', pg.getResults);
  app.get('/db/feeds/:feedid/source', pg.getFeedSource);
  app.get('/db/feeds/:feedid/validations/errorCount', pg.getValidationsErrorCount);

  // errors
  app.get('/db/feeds/:feedid/election/contests/:contestid/ballot/candidates/:candidateid/errors', pgErrors.getFeedCandidateErrors);
  app.get('/db/feeds/:feedid/election/contests/:contestid/ballot/errors', pgErrors.getFeedContestBallotErrors);
  app.get('/db/feeds/:feedid/election/contests/:contestid/errors', pgErrors.getFeedContestErrors);
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
