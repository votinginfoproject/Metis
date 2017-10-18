var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');

//list early vote sites for election
var listSql = "select * from early_vote_sites where election_id = $1;";
var listHandler =
  util.simpleQueryResponder(listSql, util.pathParamExtractor(['electionid']));

//retrieve early vote site by id
var getSql = "select * from early_vote_sites where id = $1";
var getHandler = util.simpleQueryResponder(getSql,
                                           util.pathParamExtractor(['earlyvotesiteid']));

//create early vote site
var createSql = "INSERT into early_vote_sites(election_id, id, county_fips, type, " +
  "name, address_1, address_2, address_3, city, state, zip, directions, voter_services) values " +
  "($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);"

var createParamsFn =
  util.compoundParamExtractor([util.pathParamExtractor(['electionid']),
                               util.uuidGenerator(),
                               util.bodyParamExtractor(['county_fips','type',
                                                        'name','address_1','address_2',
                                                        'address_3','city','state',
                                                        'zip','directions',
                                                        'voter_services'])]);
var createHandler =
  util.simpleCommandResponder(createSql, createParamsFn);

//delete early vote site
var deleteSql = "delete from early_vote_sites where id = $1;"
var deleteHandler = util.simpleCommandResponder(deleteSql,
                                                util.pathParamExtractor(['earlyvotesiteid']));

function registerEarlyVoteSiteServices (app) {
  app.post('/earlyvote/elections/:electionid/earlyvotesites', createHandler);
  app.get('/earlyvote/elections/:electionid/earlyvotesites', listHandler);
  app.get('/earlyvote/earlyvotesites/:earlyvotesiteid', getHandler);
  app.delete('/earlyvote/earlyvotesites/:earlyvotesiteid', deleteHandler);
}

exports.registerEarlyVoteSiteServices = registerEarlyVoteSiteServices;
