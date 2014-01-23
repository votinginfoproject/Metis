/**
 * Created by bantonides on 1/15/14.
 */
var utils = require('./utils');
var dao = require('../dao/db');

function registerErrorServices (app) {

  app.get('/services/feeds/:feedId/errors', utils.ensureAuthentication, feedErrorsGET);
  app.get('/services/feeds/:feedId/source/errors', utils.ensureAuthentication, sourceErrorsGET);
  app.get('/services/feeds/:feedId/election/errors', utils.ensureAuthentication, electionErrorsGET);

}

function feedErrorsGET (req, res) {

};

function sourceErrorsGET (req, res) {

};

function electionErrorsGET (req, res) {

};

exports.registerErrorServices = registerErrorServices;