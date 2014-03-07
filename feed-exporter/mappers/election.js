/**
 * Created by rcartier13 on 3/4/14.
 */

var db = require('../../dao/db');
var moment = require('moment');
var util = require('./util');

function electionExport(feedId, callback) {
  db.getFeedElection(feedId, function(err, result) {

    if(!result) {
      callback(-1);
      return;
    }

    var chunk = util.startElement('election', 'id', result.elementId.toString());

    if(result.date)
      chunk += util.startEndElement('date', moment(result.date).utc().format('YYYY-MM-DD'));
    if(result.electionType)
      chunk += util.startEndElement('type', result.electionType);
    if(result.statewide != undefined && result.statewide != null)
      chunk += util.startEndElement('state_wide', result.statewide ? 'yes' : 'no');
    if(result.registrationInfo)
      chunk += util.startEndElement('registration_info', result.registrationInfo);
    if(result.absenteeBallotInfo)
      chunk += util.startEndElement('absentee_ballot_info', result.absenteeBallotInfo);
    if(result.resultsUrl)
      chunk += util.startEndElement('results_url', result.resultsUrl);
    if(result.pollingHours)
      chunk += util.startEndElement('polling_hours', result.pollingHours);
    if(result.electionDayRegistration != null && result.electionDayRegistration != undefined)
      chunk += util.startEndElement('election_day_registration', result.electionDayRegistration ? 'yes' : 'no');
    if(result.registrationDeadline)
      chunk += util.startEndElement('registration_deadline', moment(result.registrationDeadline).utc().format('YYYY-MM-DD'));
    if(result.absenteeRequestDeadline)
      chunk += util.startEndElement('absentee_request_deadline', moment(result.absenteeRequestDeadline).utc().format('YYYY-MM-DD'));
    if(result.stateId)
      chunk += util.startEndElement('state_id', result.stateId);

    chunk += util.endElement('election');
    console.log('election finished');
    callback(chunk);
  });
}

exports.electionExport = electionExport;