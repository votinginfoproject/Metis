/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var moment = require('moment');

function contestExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.Contest.find({_feed: feedId}, function(err, results) {
    var contest = writer.declareElement(namespace, 'contest');
    var type = writer.declareElement(namespace, 'type');
    var partisan = writer.declareElement(namespace, 'partisan');
    var primaryParty = writer.declareElement(namespace, 'primary_party');
    var electorateSpec = writer.declareElement(namespace, 'electorate_specifications');
    var special = writer.declareElement(namespace, 'special');
    var office = writer.declareElement(namespace, 'office');
    var filingDate = writer.declareElement(namespace, 'filing_closed_date');
    var numberElected = writer.declareElement(namespace, 'number_elected');
    var numberVotingFor = writer.declareElement(namespace, 'number_voting_for');
    var ballotPlacement = writer.declareElement(namespace, 'ballot_placement');
    var electionId = writer.declareElement(namespace, 'election_id');
    var electoralDistrictId = writer.declareElement(namespace, 'electoral_district_id');
    var ballotId = writer.declareElement(namespace, 'ballot_id');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(contest).addAttribute(idAttr, result.elementId.toString());

      if(result.type)
        receiver = receiver.startElement(type).addText(result.type).endElement();
      if(result.partisan != undefined && result.partisan != null)
        receiver = receiver.startElement(partisan).addText(result.partisan ? 'yes' : 'no').endElement();
      if(result.primaryParty)
        receiver = receiver.startElement(primaryParty).addText(result.primaryParty).endElement();
      if(result.electorateSpecifications)
        receiver = receiver.startElement(electorateSpec).addText(result.electorateSpecifications).endElement();
      if(result.special != undefined && result.special != null)
        receiver = receiver.startElement(special).addText(result.special ? 'yes' : 'no').endElement();
      if(result.office)
        receiver = receiver.startElement(office).addText(result.office).endElement();
      if(result.filingClosedDate)
        receiver = receiver.startElement(filingDate).addText(moment(result.filingClosedDate).utc().format('YYYY-MM-DD')).endElement();
      if(result.numberElected)
        receiver = receiver.startElement(numberElected).addText(result.numberElected.toString()).endElement();
      if(result.numberVotingFor)
        receiver = receiver.startElement(numberVotingFor).addText(result.numberVotingFor.toString()).endElement();
      if(result.ballotPlacement)
        receiver = receiver.startElement(ballotPlacement).addText(result.ballotPlacement.toString()).endElement();
      if(result.electionId)
        receiver = receiver.startElement(electionId).addText(result.electionId.toString()).endElement();
      if(result.electoralDistrictId)
        receiver = receiver.startElement(electoralDistrictId).addText(result.electoralDistrictId.toString()).endElement();
      if(result.ballotId)
        receiver = receiver.startElement(ballotId).addText(result.ballotId.toString()).endElement();

      receiver = receiver.endElement();
    });

    console.log('contest finished');
    callback();
  })
}

exports.contestExport = contestExport;