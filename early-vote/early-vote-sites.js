var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');

//list early vote sites for election
var listSql = `select * from early_vote_sites where election_id = $1
               and (($2 = 'undefined') or (county_fips ~ $2))
               order by city desc;`
var listParamsFn =
  util.compoundParamExtractor([util.pathParamExtractor(['electionid']),
                               util.queryParamExtractor(['fips'])]);
var listHandler =
  util.simpleQueryResponder(listSql, listParamsFn);

//retrieve early vote site by id
var getSql = "select * from early_vote_sites where id = $1";
var getHandler = util.simpleQueryResponder(getSql,
                                           util.pathParamExtractor(['earlyvotesiteid']));

//create early vote site
var createSql = `insert into early_vote_sites(election_id, id, county_fips, type,
   name, address_1, address_2, address_3, city, state, zip, directions, voter_services) values
   ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13);`

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

//update early vote site, updates all values so values that remain constant
//must still be passed in, values that are not present will be set to null
var updateSql = `UPDATE early_vote_sites SET county_fips = $1, type = $2,
  name = $3, address_1 = $4, address_2 = $5, address_3 = $6, city = $7,
  state = $8, zip = $9, directions = $10, voter_services = $11
  WHERE id = $12;`

var updateParamsFn =
  util.compoundParamExtractor([util.bodyParamExtractor(['county_fips','type',
                                                        'name','address_1','address_2',
                                                        'address_3','city','state',
                                                        'zip','directions',
                                                        'voter_services']),
                                util.pathParamExtractor(['earlyvotesiteid'])]);
var updateHandler =
  util.simpleCommandResponder(updateSql, updateParamsFn);

//delete early vote site
var deleteSql = "delete from early_vote_sites where id = $1;"
var deleteHandler = util.simpleCommandResponder(deleteSql,
                                                util.pathParamExtractor(['earlyvotesiteid']));

function registerEarlyVoteSiteServices (app) {
  app.post('/earlyvote/elections/:electionid/earlyvotesites', createHandler);
  app.get('/earlyvote/elections/:electionid/earlyvotesites', listHandler);
  app.get('/earlyvote/earlyvotesites/:earlyvotesiteid', getHandler);
  app.delete('/earlyvote/earlyvotesites/:earlyvotesiteid', deleteHandler);
  app.put('/earlyvote/earlyvotesites/:earlyvotesiteid', updateHandler);
}

exports.registerEarlyVoteSiteServices = registerEarlyVoteSiteServices;
