/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var attrEx = require('./address');

function electionAdminExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.ElectionAdmin.find({_feed: feedId}, function(err, results) {
    var electionAdmin = writer.declareElement(namespace, 'election_administration');
    var name = writer.declareElement(namespace, 'name');
    var eoId = writer.declareElement(namespace, 'eo_id');
    var ovcId = writer.declareElement(namespace, 'ovc_id');
    var physicalAddress = writer.declareElement(namespace, 'physical_address');
    var mailingAddress = writer.declareElement(namespace, 'mailing_address');
    var electionsUrl = writer.declareElement(namespace, 'elections_url');
    var registrationUrl = writer.declareElement(namespace, 'registration_url');
    var amIRegisteredUrl = writer.declareElement(namespace, 'am_i_registered_url');
    var absenteeUrl = writer.declareElement(namespace,'absentee_url');
    var whereDoIVoteUrl = writer.declareElement(namespace, 'where_do_i_vote_url');
    var whatIsOnMyBallotUrl = writer.declareElement(namespace, 'what_is_on_my_ballot_ur');
    var rulesUrl = writer.declareElement(namespace, 'rules_url');
    var voterServices = writer.declareElement(namespace, 'voter_services');
    var hours = writer.declareElement(namespace, 'hours');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(electionAdmin).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.eoId)
        receiver = receiver.startElement(eoId).addText(result.eoId.toString()).endElement();
      if(result.ovcId)
        receiver = receiver.startElement(ovcId).addText(result.ovcId.toString()).endElement();
      if(result.physicalAddress)
        attrEx.addressExport(receiver, writer, namespace, physicalAddress, result.physicalAddress);
      if(result.mailingAddress)
        attrEx.addressExport(receiver, writer, namespace, mailingAddress, result.mailingAddress);
      if(result.electionsUrl)
        receiver = receiver.startElement(electionsUrl).addText(result.electionsUrl).endElement();
      if(result.registrationUrl)
        receiver = receiver.startElement(registrationUrl).addText(result.registrationUrl).endElement();
      if(result.amIRegisteredUrl)
        receiver = receiver.startElement(amIRegisteredUrl).addText(result.amIRegisteredUrl).endElement();
      if(result.absenteeUrl)
        receiver = receiver.startElement(absenteeUrl).addText(result.absenteeUrl).endElement();
      if(result.whereDoIVoteUrl)
        receiver = receiver.startElement(whereDoIVoteUrl).addText(result.whereDoIVoteUrl).endElement();
      if(result.whatIsOnMyBallotUrl)
        receiver = receiver.startElement(whatIsOnMyBallotUrl).addText(result.whatIsOnMyBallotUrl).endElement();
      if(result.rulesUrl)
        receiver = receiver.startElement(rulesUrl).addText(result.rulesUrl).endElement();
      if(result.voterServices)
        receiver = receiver.startElement(voterServices).addText(result.voterServices).endElement();
      if(result.hours)
        receiver = receiver.startElement(hours).addText(result.hours).endElement();

      receiver = receiver.endElement();
    });

    console.log('election admin finished');
    callback();
  });
}

exports.electionAdminExport = electionAdminExport;