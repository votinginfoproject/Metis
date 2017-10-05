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
var createElection = util.simpleCommandResponder(createSql, createElectionsParamFn);

var listAllElectionsSql = "SELECT * FROM elections order by election_date asc";
var listElectionsForFipsSql = "SELECT * FROM elections where state_fips = $1 order by election_date asc";
var listElections = function(req, resp) {
  var fips = req.query['fips'];
  if (fips) {
    var respFn = util.simpleQueryResponder(listElectionsForFipsSql, function(req) {
      return [fips];
    });
    respFn(req, resp);
  } else {
    var respFn = util.simpleQueryResponder(listAllElectionsSql);
    respFn(req, resp);
  }
}

function registerElectionServices (app) {
  //app.all('/evs/elections/*', auth.checkJwt);
  app.post('/earlyvote/elections', createElection);
  app.get('/earlyvote/elections', listElections);
}

exports.registerElectionServices = registerElectionServices;
