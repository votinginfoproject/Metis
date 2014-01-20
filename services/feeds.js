/**
 * Created by bantonides on 12/3/13.
 */
var utils = require('./utils');
var dao = require('../dao/db');
var httpCallback = require('./HttpCallbacks');

dao.dbConnect();

function registerFeedsServices (app) {
  /*
   * REST endpoints associated with Feed data
   */
  app.get('/services/feeds', utils.ensureAuthentication, httpCallback.allFeedsGET);
  app.get('/services/feeds/:feedid', utils.ensureAuthentication, httpCallback.feedOverviewGET);
  app.get('/services/feeds/:feedid/source', utils.ensureAuthentication, httpCallback.feedSourceGET);
  app.get('/services/feeds/:feedid/election', utils.ensureAuthentication, httpCallback.feedElectionGET);
  app.get('/services/feeds/:feedid/election/state', utils.ensureAuthentication, httpCallback.feedStateGET);
  app.get('/services/feeds/:feedid/election/state/earlyvotesites', utils.ensureAuthentication, httpCallback.feedStateEarlyVoteSitesGET);
  app.get('/services/feeds/:feedid/election/state/electionadministration', utils.ensureAuthentication, httpCallback.feedStateElectionAdministrationGET);
  app.get('/services/feeds/:feedid/election/state/localities', utils.ensureAuthentication, httpCallback.feedLocalitiesGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid', utils.ensureAuthentication, httpCallback.feedLocalityGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/earlyvotesites', utils.ensureAuthentication, httpCallback.feedLocalityEarlyVoteSitesGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/electionadministration', utils.ensureAuthentication, httpCallback.feedLocalityElectionAdministrationGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts', utils.ensureAuthentication, httpCallback.feedLocalityPrecinctsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid', utils.ensureAuthentication, httpCallback.feedPrecinctGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/earlyvotesites', utils.ensureAuthentication, httpCallback.feedPrecinctEarlyVoteSitesGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/electoraldistricts', utils.ensureAuthentication, httpCallback.feedPrecinctElectoralDistrictsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/pollinglocations', utils.ensureAuthentication, httpCallback.feedPrecinctPollingLocationsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits', utils.ensureAuthentication, httpCallback.feedPrecinctPrecinctSplitsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments', utils.ensureAuthentication, httpCallback.feedPrecinctStreetSegmentsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments/errors', utils.ensureAuthentication, httpCallback.feedPrecinctStreetSegmentsErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid', utils.ensureAuthentication, httpCallback.feedPrecinctSplitGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/electoraldistricts', utils.ensureAuthentication, httpCallback.feedPrecinctSplitElectoralDistrictsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/pollinglocations', utils.ensureAuthentication, httpCallback.feedPrecinctSplitPollingLocationsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/streetsegments', utils.ensureAuthentication, httpCallback.feedPrecinctSplitStreetSegmentsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/streetsegments/errors', utils.ensureAuthentication, httpCallback.feedPrecinctSplitStreetSegmentsErrorsGET);
  app.get('/services/feeds/:feedid/election/state/earlyvotesites/:evsid', utils.ensureAuthentication, httpCallback.feedEarlyVoteSiteGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/earlyvotesites/:evsid', utils.ensureAuthentication, httpCallback.feedEarlyVoteSiteGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/earlyvotesites/:evsid', utils.ensureAuthentication, httpCallback.feedEarlyVoteSiteGET);
  app.get('/services/feeds/:feedid/election/contests', utils.ensureAuthentication, httpCallback.feedElectionContestsGET);
  app.get('/services/feeds/:feedid/polling', utils.ensureAuthentication, httpCallback.feedPollingGET);
  app.get('/services/feeds/:feedid/contests', utils.ensureAuthentication, httpCallback.feedContestsGET);
  app.get('/services/feeds/:feedid/results', utils.ensureAuthentication, httpCallback.feedResultsGET);
  app.get('/services/feeds/:feedid/history', utils.ensureAuthentication, httpCallback.feedHistoryGET);
};

exports.registerFeedsServices = registerFeedsServices;
