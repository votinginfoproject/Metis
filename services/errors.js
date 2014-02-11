/**
 * Created by bantonides on 2/10/14.
 */
var utils = require('./utils');
var callbacks = require('./errorCallbacks');

function registerErrorServices (app) {

  app.get('/services/feeds/:feedid/errors', utils.ensureAuthentication, callbacks.allErrorsGET);
  app.get('/services/feeds/:feedid/source/errors', utils.ensureAuthentication, callbacks.sourceErrorsGET);
  app.get('/services/feeds/:feedid/election/errors', utils.ensureAuthentication, callbacks.electionErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctStreetSegmentsErrorsGET);
  app.get('/services/feeds/:feedid/election/state/localities/:localityid/precincts/:precinctid/precinctsplits/:splitid/streetsegments/errors', utils.ensureAuthentication, callbacks.precinctSplitStreetSegmentsErrorsGET);

}

exports.registerErrorServices = registerErrorServices;
