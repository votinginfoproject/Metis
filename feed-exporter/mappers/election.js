/**
 * Created by rcartier13 on 3/4/14.
 */

var logger = (require('../../logging/vip-winston')).Logger;
var db = require('../../dao/db');
var moment = require('moment');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function electionExport(feedId, callback) {
  logger.info('Export Election Started');
  db.getFeedElection(feedId, function(err, result) {

    if(!result) {
      callback(-1);
      logger.info('election finished');
      return;
    }

    var chunk = util.startElement('election', 'id', _.escape(result.elementId.toString()));

    if(result.date)
      chunk += util.startEndElement('date', _.escape(moment(result.date).utc().format('YYYY-MM-DD')));
    if(result.electionType)
      chunk += util.startEndElement('election_type', _.escape(result.electionType));
    if(result.statewide != undefined && result.statewide != null)
      chunk += util.startEndElement('statewide', result.statewide ? 'yes' : 'no');
    if(result.registrationInfo)
      chunk += util.startEndElement('registration_info', _.escape(result.registrationInfo));
    if(result.absenteeBallotInfo)
      chunk += util.startEndElement('absentee_ballot_info', _.escape(result.absenteeBallotInfo));
    if(result.resultsUrl)
      chunk += util.startEndElement('results_url', _.escape(result.resultsUrl));
    if(result.pollingHours)
      chunk += util.startEndElement('polling_hours', _.escape(result.pollingHours));
    if(result.electionDayRegistration != null && result.electionDayRegistration != undefined)
      chunk += util.startEndElement('election_day_registration', result.electionDayRegistration ? 'yes' : 'no');
    if(result.registrationDeadline)
      chunk += util.startEndElement('registration_deadline', _.escape(moment(result.registrationDeadline).utc().format('YYYY-MM-DD')));
    if(result.absenteeRequestDeadline)
      chunk += util.startEndElement('absentee_request_deadline', _.escape(moment(result.absenteeRequestDeadline).utc().format('YYYY-MM-DD')));
    if(result.stateId)
      chunk += util.startEndElement('state_id', _.escape(result.stateId.toString()));

    chunk += util.endElement('election');
    logger.info('Export Election Finished');
    logger.info('----------------------------');
    callback(pd.xml(chunk));
  });
}

exports.electionExport = electionExport;