var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');

//create election
var createSql = "INSERT INTO elections VALUES ($1, $2, $3);"
var createElectionsParamFn =
  util.compoundParamExtractor([util.uuidGenerator(),
                               util.bodyParamExtractor(['state_fips', 'election_date'])]);
var createElection = util.simpleCommandResponder(createSql, createElectionsParamFn);

//list elections
var getElectionsQuery =
  "select * from elections where election_date >= current_date AND " +
  "(($1 = 'undefined') or (state_fips = $1)) order by election_date asc;"
var getElections = util.simpleQueryResponder(getElectionsQuery, util.queryParamExtractor(['fips']));

//get single election
var getElectionQuery =
  "select * from elections where id = $1";
var getElection = util.simpleQueryResponder(getElectionQuery, util.pathParamExtractor(['electionid']));

function registerElectionServices (app) {
  app.post('/earlyvote/elections', createElection);
  app.get('/earlyvote/elections', getElections);
  app.get('/earlyvote/elections/:electionid', getElection);
}

exports.registerElectionServices = registerElectionServices;
