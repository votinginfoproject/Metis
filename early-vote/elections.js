var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var access = require('./access.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');
var auth = require('../authentication/services.js');

//create election
var createSql = "INSERT INTO elections VALUES ($1, $2, $3);"
var createElectionsParamFn =
  util.compoundParamExtractor([util.uuidGenerator(),
                               util.bodyParamExtractor(['state_fips', 'election_date'])]);
var createElection = util.simpleCommandResponder(createSql, createElectionsParamFn);

//list elections
var getElectionsQuery =
  `select * from elections where election_date >= current_date AND
   (($1 = 'super-admin') or (state_fips = $1)) order by election_date asc;`
var getElections = util.simpleQueryResponder(getElectionsQuery, access.adminFipsExtractor());

//get single election
var getElectionQuery =
  "select * from elections where id = $1";
var getElection = util.simpleQueryResponder(getElectionQuery, util.pathParamExtractor(['electionid']));

//update election
var updateSql = "UPDATE elections set state_fips = $2, election_date = $3 where id = $1;"
var updateElectionsParamFn =
  util.compoundParamExtractor([util.pathParamExtractor(['electionid']),
                               util.bodyParamExtractor(['state_fips', 'election_date'])]);
var updateElection = util.simpleCommandResponder(updateSql, updateElectionsParamFn);

//delete election
var deleteSql = "delete from elections where id = $1;"
var deleteElection = util.simpleCommandResponder(deleteSql,
                                                 util.pathParamExtractor(['electionid']));

function registerElectionServices (app) {
	// only admin
  app.post('/earlyvote/elections', access.verifyAdmin, createElection);
	// all users, admins can see all elections, others only matching state component of fips
  app.get('/earlyvote/elections', getElections);
	// admin user or election state_fips must match user state_fips
  app.get('/earlyvote/elections/:electionid', access.verifyElection, getElection);
	// only admin
  app.put('/earlyvote/elections/:electionid', access.verifyAdmin, updateElection);
	// only admin
  app.delete('/earlyvote/elections/:electionid', access.verifyAdmin, deleteElection);
}

exports.registerElectionServices = registerElectionServices;
