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
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/errors', utils.ensureAuthentication, callbacks.localityErrorsGET);
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
  app.get('/services/feeds/:feedid/election/contests/:contestid/contestresult/errors', utils.ensureAuthentication, callbacks.contestResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/errors', utils.ensureAuthentication, callbacks.ballotErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/customballot/errors', utils.ensureAuthentication, callbacks.ballotCustomBallotErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/ballotresponses/errors', utils.ensureAuthentication, callbacks.ballotBallotResponsesErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballotlineresults/:ballotlineresult/errors', utils.ensureAuthentication, callbacks.ballotLineResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/referenda/:referendumid/errors', utils.ensureAuthentication, callbacks.referendumErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/referenda/:referendumid/ballotresponses/errors', utils.ensureAuthentication, callbacks.referendumBallotResponsesErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballot/candidates/:candidateid/errors', utils.ensureAuthentication, callbacks.candidateErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/pollinglocations/:pollinglocationid/errors', utils.ensureAuthentication, callbacks.pollingLocErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/pollinglocations/:pollinglocationid/errors', utils.ensureAuthentication, callbacks.pollingLocErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/ballotlineresults/:blrid/errors', utils.ensureAuthentication, callbacks.ballotLineResultErrorsGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/contestresult/errors', utils.ensureAuthentication, callbacks.contestResultErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctStreetSegmentsErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctSplitStreetSegmentsErrorsGET);

  // error indexes for overview modules under the Feed Overview page
  app.get('/services/feeds/:feedid/overview/:type/errors', utils.ensureAuthentication, callbacks.errorIndexGET);

  // error indexes for overview modules under a specific Locality
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/overview/earlyvotesites/errors', utils.ensureAuthentication, callbacks.errorIndexLocalityEarlyVoteSiteGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/overview/electionadministration/errors', utils.ensureAuthentication, callbacks.errorIndexLocalityElectionAdministrationGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/overview/pollinglocations/errors', utils.ensureAuthentication, callbacks.errorIndexLocalityPollingLocationsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/overview/precinctsplits/errors', utils.ensureAuthentication, callbacks.errorIndexLocalityPrecinctSplitsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/overview/precincts/errors', utils.ensureAuthentication, callbacks.errorIndexLocalityPrecinctsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid(\\d+)/overview/streetsegments/errors', utils.ensureAuthentication, callbacks.errorIndexLocalityStreetSegmentsGET);

  // error indexes for overview modules under a specific Contest
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/overview/ballot/errors', utils.ensureAuthentication, callbacks.errorIndexContestBallotGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/overview/candidates/errors', utils.ensureAuthentication, callbacks.errorIndexContestCandidatesGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/overview/electoraldistrict/errors', utils.ensureAuthentication, callbacks.errorIndexContestElectoralDistrictGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid(\\d+)/overview/referenda/errors', utils.ensureAuthentication, callbacks.errorIndexContestReferendaGET);

}

exports.registerErrorServices = registerErrorServices;
