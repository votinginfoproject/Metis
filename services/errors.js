/**
 * Created by bantonides on 2/10/14.
 */
var utils = require('./utils');
var callbacks = require('./errorCallbacks');

function registerErrorServices (app) {

  app.get('/services/feeds/:feedid/errors', utils.ensureAuthentication, callbacks.allErrorsGET);
  app.get('/services/feeds/:feedid/source/errors', utils.ensureAuthentication, callbacks.sourceErrorsGET);
  app.get('/services/feeds/:feedid/election/errors', utils.ensureAuthentication, callbacks.electionErrorsGET);
  app.get('/services/feeds/:feedid/election/state/errors', utils.ensureAuthentication, callbacks.stateErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:loaclityid/errors', utils.ensureAuthentication, callbacks.localityErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/errors', utils.ensureAuthentication, callbacks.precinctErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/electoraldistricts/:districtid/errors', utils.ensureAuthentication, callbacks.electoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/electoraldistricts/:districtid/errors', utils.ensureAuthentication, callbacks.electoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/electoraldistricts/:districtid', utils.ensureAuthentication, callbacks.electoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/electoraldistrict/errors', utils.ensureAuthentication, callbacks.contestElectoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/errors', utils.ensureAuthentication, callbacks.contestErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/errors', utils.ensureAuthentication, callbacks.precinctSplitErrorsGET);
  app.get('/services/feeds/:feedid/election/state/earlyvotesites/:evsid/errors', utils.ensureAuthentication, callbacks.earlyVoteSiteErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/earlyvotesites/:evsid/errors', utils.ensureAuthentication, callbacks.earlyVoteSiteErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/earlyvotesites/:evsid/errors', utils.ensureAuthentication, callbacks.earlyVoteSiteErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/electionadministration/errors', utils.ensureAuthentication, callbacks.localityElectionAdminErrorsGET);
  app.get('/services/feeds/:feedid/election/state/electionadministration/errors', utils.ensureAuthentication, callbacks.stateElectionAdminErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/errors', utils.ensureAuthentication, callbacks.ballotErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/referenda/:referendumid/errors', utils.ensureAuthentication, callbacks.referendumErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/candidates/:candidateid/errors', utils.ensureAuthentication, callbacks.candidateErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/pollinglocations/:pollinglocationid/errors', utils.ensureAuthentication, callbacks.pollingLocErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/pollinglocations/:pollinglocationid/errors', utils.ensureAuthentication, callbacks.pollingLocErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballotlineresults/:blrid/errors', utils.ensureAuthentication, callbacks.ballotLineResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/contestresult/errors', utils.ensureAuthentication, callbacks.contestResultErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctStreetSegmentsErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctSplitStreetSegmentsErrorsGET);

}

exports.registerErrorServices = registerErrorServices;
