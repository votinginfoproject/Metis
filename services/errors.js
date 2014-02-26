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
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/errors', utils.ensureAuthentication, callbacks.localityErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/errors', utils.ensureAuthentication, callbacks.precinctErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/electoraldistricts/:districtid(\\d+)/errors', utils.ensureAuthentication, callbacks.electoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/precinctsplits/:splitid(\\d+)/electoraldistricts/:districtid(\\d+)/errors', utils.ensureAuthentication, callbacks.electoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/electoraldistricts/:districtid(\\d+)', utils.ensureAuthentication, callbacks.electoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/electoraldistrict/errors', utils.ensureAuthentication, callbacks.contestElectoralDistrictErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/errors', utils.ensureAuthentication, callbacks.contestErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/precinctsplits/:splitid(\\d+)/errors', utils.ensureAuthentication, callbacks.precinctSplitErrorsGET);
  app.get('/services/feeds/:feedid/election/state/earlyvotesites/:evsid(\\d+)/errors', utils.ensureAuthentication, callbacks.earlyVoteSiteErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/earlyvotesites/:evsid(\\d+)/errors', utils.ensureAuthentication, callbacks.earlyVoteSiteErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/earlyvotesites/:evsid(\\d+)/errors', utils.ensureAuthentication, callbacks.earlyVoteSiteErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/electionadministration/errors', utils.ensureAuthentication, callbacks.localityElectionAdminErrorsGET);
  app.get('/services/feeds/:feedid/election/state/electionadministration/errors', utils.ensureAuthentication, callbacks.stateElectionAdminErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/contestresult/errors', utils.ensureAuthentication, callbacks.contestResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballot/errors', utils.ensureAuthentication, callbacks.ballotErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballot/customballot/errors', utils.ensureAuthentication, callbacks.ballotCustomBallotErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballot/ballotresponses/errors', utils.ensureAuthentication, callbacks.ballotBallotResponsesErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballotlineresults/:ballotlineresult(\\d+)/errors', utils.ensureAuthentication, callbacks.ballotLineResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballot/referenda/:referendumid(\\d+)/errors', utils.ensureAuthentication, callbacks.referendumErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballot/referenda/:referendumid(\\d+)/ballotresponses/errors', utils.ensureAuthentication, callbacks.referendumBallotResponsesErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballot/candidates/:candidateid(\\d+)/errors', utils.ensureAuthentication, callbacks.candidateErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/pollinglocations/:pollinglocationid(\\d+)/errors', utils.ensureAuthentication, callbacks.pollingLocErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/precinctsplits/:splitid(\\d+)/pollinglocations/:pollinglocationid(\\d+)/errors', utils.ensureAuthentication, callbacks.pollingLocErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/ballotlineresults/:blrid(\\d+)/errors', utils.ensureAuthentication, callbacks.ballotLineResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/contestresult/errors', utils.ensureAuthentication, callbacks.contestResultErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctStreetSegmentsErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/precincts/:precinctid(\\d+)/precinctsplits/:splitid(\\d+)/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctSplitStreetSegmentsErrorsGET);

}

exports.registerErrorServices = registerErrorServices;
