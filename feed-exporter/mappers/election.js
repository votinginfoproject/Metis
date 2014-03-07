/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var db = require('../../dao/db');
var moment = require('moment');

function electionExport(feedId, writer, receiver, namespace, callback) {
  db.getFeedElection(feedId, function(err, result) {
    var election = writer.declareElement(namespace, 'election');
    var date = writer.declareElement(namespace, 'date');
    var type = writer.declareElement(namespace, 'election_type');
    var statewide = writer.declareElement(namespace, 'statewide');
    var registrationInfo = writer.declareElement(namespace, 'registration_info');
    var resultsUrl = writer.declareElement(namespace, 'results_url');
    var pollingHours = writer.declareElement(namespace, 'polling_hours');
    var electionDayRegistration = writer.declareElement(namespace, 'election_day_registration');
    var registrationDeadline = writer.declareElement(namespace, 'registration_deadline');
    var absenteeRequestDeadline = writer.declareElement(namespace, 'absentee_request_deadline');
    var stateId = writer.declareElement(namespace, 'state_id');
    var absenteeBallot = writer.declareElement(namespace, 'absentee_ballot_info');

    var idAttr = writer.declareAttribute('id');

    if(!result)
      return;

    receiver = receiver.startElement(election).addAttribute(idAttr, result.elementId.toString());

    if(result.date)
      receiver = receiver.startElement(date).addText(moment(result.date).utc().format('YYYY-MM-DD')).endElement();
    if(result.electionType)
      receiver = receiver.startElement(type).addText(result.electionType).endElement();
    if(result.statewide != undefined && result.statewide != null)
      receiver = receiver.startElement(statewide).addText(result.statewide ? 'yes' : 'no').endElement();
    if(result.registrationInfo)
      receiver = receiver.startElement(registrationInfo).addText(result.registrationInfo).endElement();
    if(result.absenteeBallotInfo)
      receiver = receiver.startElement(absenteeBallot).addText(result.absenteeBallotInfo).endElement();
    if(result.resultsUrl)
      receiver = receiver.startElement(resultsUrl).addText(result.resultsUrl).endElement();
    if(result.pollingHours)
      receiver = receiver.startElement(pollingHours).addText(result.pollingHours).endElement();
    if(result.electionDayRegistration != null && result.electionDayRegistration != undefined)
      receiver = receiver.startElement(electionDayRegistration).addText(result.electionDayRegistration ? 'yes' : 'no').endElement();
    if(result.registrationDeadline)
      receiver = receiver.startElement(registrationDeadline).addText(moment(result.registrationDeadline).utc().format('YYYY-MM-DD')).endElement();
    if(result.absenteeRequestDeadline)
      receiver = receiver.startElement(absenteeRequestDeadline).addText(moment(result.absenteeRequestDeadline).utc().format('YYYY-MM-DD')).endElement();
    if(result.stateId)
      receiver = receiver.startElement(stateId).addText(result.stateId).endElement();

    receiver = receiver.endElement();

    console.log('election finished');
    callback();
  });
}

exports.electionExport = electionExport;