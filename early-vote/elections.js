var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var auth = require('../authentication/services.js');
var uuidv4 = require('uuid/v4');

//create election
var createSql = "INSERT INTO elections VALUES ($1, $2, $3);"
var createElectionsParamFn = function(req) {
  var params = [];
  params.push(uuidv4());
  params.push(req.body['state_fips']);
  params.push(req.body['election_date']);
  return params;
}
var createElection = util.simpleCommandResponder(createSql, createElectionsParamFn);

//list elections
var getElectionsQuery =
  "select * from elections where election_date >= current_date AND " +
  "(($1 = 'undefined') or (state_fips = $1)) order by election_date asc;"
var getElectionsParamFn = function(req) {
  var params = [];
  params.push(decodeURIComponent(req.query['fips']));
  return params;
}
var getElections = util.simpleQueryResponder(getElectionsQuery, getElectionsParamFn);

//get single election
var getElectionQuery =
  "select * from elections where id = $1";
var getElection = util.simpleQueryResponder(getElectionQuery, util.pathParamExtractor(['electionid']));

function registerElectionServices (app) {
  //app.all('/evs/elections/*', auth.checkJwt);
  app.post('/earlyvote/elections', createElection);
  app.get('/earlyvote/elections', getElections);
  app.get('/earlyvote/elections/:electionid', getElection);
}

exports.registerElectionServices = registerElectionServices;
