/**
 * Created by bantonides on 2/18/14.
 */

var utils = require('./utils');
var dao = require('../dao/db');
var geoCallbacks = require('./geoCallbacks');

function registerGeoServices (app) {
  app.get('/services/geo/:stateId/counties', utils.ensureAuthentication, geoCallbacks.stateCountiesGET);
  app.get('/services/geo/:stateId/counties/:countyId', utils.ensureAuthentication, geoCallbacks.countyGET);
}

exports.registerGeoServices = registerGeoServices;
