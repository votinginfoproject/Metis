/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var schemas = require('../../dao/schemas');

function stateExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.State.findOne({_feed: feedId}, function(err, result) {
    var state = writer.declareElement(namespace, 'state');
    var name = writer.declareElement(namespace, 'name');
    var electionAdministrationId = writer.declareElement(namespace, 'election_administration_id');
    var earlyVoteSiteId = writer.declareElement(namespace, 'early_vote_site_id');

    var idAttr = writer.declareAttribute('id');

    if(!result)
      return;

    receiver = receiver.startElement(state).addAttribute(idAttr, result.elementId.toString());

    if(result.name)
      receiver = receiver.startElement(name).addText(result.name).endElement();
    if(result.electionAdministrationId)
      receiver = receiver.startElement(electionAdministrationId).addText(result.electionAdministrationId.toString()).endElement();
    if(result.earlyVoteSiteIds.length) {
      result.earlyVoteSiteIds.forEach(function(ids) {
        receiver = receiver.startElement(earlyVoteSiteId).addText(ids.toString()).endElement();
      })
    }


    receiver = receiver.startElement(name).addText(result.name).endElement();receiver.endElement();
    console.log('state finished');
    callback()
  });
}

exports.stateExport = stateExport;