/**
 * Created by rcartier13 on 2/18/14.
 */

var utils = require('./utils');
var callbacks = require('./overviewCallbacks');

function registerOverviewServices (app) {

  app.get('/services/feeds/:feedid/election/state/localities/:localityid/localityoverview', utils.ensureAuthentication, callbacks.localityOverviewGET);
  app.get('/services/feeds/:feedid/election/contests/:contestid/contestoverview', utils.ensureAuthentication, callbacks.contestOverviewGET);
  app.get('/services/feeds/:feedid/polling', utils.ensureAuthentication, callbacks.localitiesOverviewGET);
  app.get('/services/feeds/:feedid/contests', utils.ensureAuthentication, callbacks.contestsOverviewGET);
  app.get('/services/feeds/:feedid/results', utils.ensureAuthentication, callbacks.resultsOverviewGET);
}

exports.registerOverviewServices = registerOverviewServices;