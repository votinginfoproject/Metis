var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');

//list assignments for early_vote_site
var listSql = "select * from assignments where early_vote_site_id = $1;";
var listHandler =
  util.simpleQueryResponder(listSql, util.pathParamExtractor(['earlyvotesiteid']));

//retrieve assignment by id
var getSql = "select * from assignments where id = $1";
var getHandler = util.simpleQueryResponder(getSql,
                                           util.pathParamExtractor(['assignmentid']));

//create assignment
var createSql = `insert into assignments(id, early_vote_site_id, schedule_id)
                 values ($1, $2, $3);`

var createParamsFn =
  util.compoundParamExtractor([util.uuidGenerator(),
                               util.pathParamExtractor(['earlyvotesiteid']),
                               util.bodyParamExtractor(['schedule_id'])]);
var createHandler =
  util.simpleCommandResponder(createSql, createParamsFn);

//delete assignment
var deleteSql = "delete from assignments where id = $1;"
var deleteHandler = util.simpleCommandResponder(deleteSql,
                                                util.pathParamExtractor(['assignmentid']));

function registerAssignmentServices (app) {
  app.post('/earlyvote/earlyvotesites/:earlyvotesiteid/assignments', createHandler);
  app.get('/earlyvote/earlyvotesites/:earlyvotesiteid/assignments', listHandler);
  app.get('/earlyvote/assignments/:assignmentid', getHandler);
  app.delete('/earlyvote/assignments/:assignmentid', deleteHandler);
}

exports.registerAssignmentServices = registerAssignmentServices;
