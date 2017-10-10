var conn = require('./conn.js');
var util = require('./util.js');
var auth = require('../authentication/services.js');
var uuidv4 = require('uuid/v4');

var createSql = "INSERT INTO elections VALUES ($1, $2, $3);"
var createElectionsParamFn = function(req) {
  var params = [];
  params.push(uuidv4());
  params.push(decodeURIComponent(req.body['state_fips']));
  params.push(decodeURIComponent(req.body['election_date']));
  return params;
}
var createElection = util.simpleComandResponder(createSql, createElectionsParamFn);

var getElectionsQuery = "select * from elections where ($1 = 'undefined') or (state_fips = $1);"
var getElectionsParamFn = function(req) {
  var params = [];
  params.push(decodeURIComponent(req.query['fips']));
  return params;
}

var getElections = util.simpleQueryResponder(getElectionsQuery, getElectionsParamFn);

function registerElectionServices (app) {
  //app.all('/evs/elections/*', auth.checkJwt);
  app.post('/earlyvote/elections', createElection);
  app.get('/earlyvote/getelections', getElections);
}

exports.registerElectionServices = registerElectionServices;
