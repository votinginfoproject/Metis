var conn = require('../dashboard/conn.js');
var util = require('../dashboard/util.js');
var access = require('./access.js');
var logger = (require('../logging/vip-winston')).Logger;
var uuidv4 = require('uuid/v4');

//list schedules for election
var listSql = `select s.id as id,
                      s.election_id,
                      s.start_date,
                      s.end_date,
                      s.start_time,
                      s.end_time,
                      s.timezone,
                      a.id as assignment_id
 from schedules s
  left outer join assignments a
  on s.id = a.schedule_id
  and a.early_vote_site_id = $2
  where s.election_id = $1
  order by s.start_date, s.start_time;`
var listHandler =
  util.simpleQueryResponder(listSql, util.pathParamExtractor(['electionid', 'earlyvotesiteid']));

//retrieve schedule by id
var getSql = "select * from schedules where id = $1";
var getHandler = util.simpleQueryResponder(getSql,
                                           util.pathParamExtractor(['scheduleid']));

//create schedule
var createSql = `INSERT into schedules(election_id, id, start_date, end_date,
                 start_time, end_time, timezone) values ($1, $2, $3, $4, $5, $6, $7);`

var createParamsFn =
  util.compoundParamExtractor([util.pathParamExtractor(['electionid']),
                               util.uuidGenerator(),
                               util.bodyParamExtractor(['start_date','end_date',
                                                        'start_time','end_time',
                                                        'timezone'])]);
var createHandler =
  util.simpleCommandResponder(createSql, createParamsFn, function (params) {return params[1];});

//update schedule, updates all values so values that remain constant
//must still be passed in, values that are not present will be set to null
var updateSql = `UPDATE schedules SET start_date = $1, end_date = $2,
                 start_time = $3, end_time = $4, timezone = $5 WHERE id = $6;`

var updateParamsFn =
  util.compoundParamExtractor([util.bodyParamExtractor(['start_date','end_date',
                                                        'start_time','end_time',
                                                        'timezone']),
                                util.pathParamExtractor(['scheduleid'])]);
var updateHandler =
  util.simpleCommandResponder(updateSql, updateParamsFn);

//delete schedule
var deleteSql = "delete from schedules where id = $1;"
var deleteHandler = util.simpleCommandResponder(deleteSql,
                                                util.pathParamExtractor(['scheduleid']));

function registerScheduleServices (app) {
	//verify admin or matching election fips
  app.post('/earlyvote/elections/:electionid/schedules', access.verifyElection, createHandler);
	//verify admin or matching election fips
  app.get('/earlyvote/elections/:electionid/earlyvotesites/:earlyvotesiteid/schedules',
	  access.verifyElection, access.verifyEVSCounty, listHandler);
	//verify admin or matching election fips schedule
  app.get('/earlyvote/schedules/:scheduleid', access.verifySchedule, getHandler);
	//verify admin or matching election fips schedule
  app.delete('/earlyvote/schedules/:scheduleid', access.verifySchedule, access.protectSchedule, deleteHandler);
	//verify admin or matching election fips schedule
  app.put('/earlyvote/schedules/:scheduleid', access.verifySchedule, access.protectSchedule, updateHandler);
}

exports.registerScheduleServices = registerScheduleServices;
