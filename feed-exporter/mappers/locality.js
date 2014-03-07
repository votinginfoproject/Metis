/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var db = require('../../dao/db');
var schemas = require('../../dao/schemas');

function localityExport(feedId, writer, receiver, namespace, callback) {

  schemas.models.Locality.find({_feed: feedId}, function(err, results) {
    var locality = writer.declareElement(namespace, 'locality');
    var name = writer.declareElement(namespace, 'name');
    var type = writer.declareElement(namespace, 'type');
    var machineType = writer.declareElement(namespace, 'election_machine_type');
    var pollBook = writer.declareElement(namespace, 'poll_book_type');
    var stateId = writer.declareElement(namespace, 'state_id');
    var electionAdminId = writer.declareElement(namespace, 'election_administration_id');
    var earlyVoteSiteId = writer.declareElement(namespace, 'early_vote_site_id');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(locality).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.type)
        receiver = receiver.startElement(type).addText(result.type).endElement();
      if(result.electionMachineType)
        receiver = receiver.startElement(machineType).addText(result.electionMachineType).endElement();
      if(result.pollBookType)
        receiver = receiver.startElement(pollBook).addText(result.pollBookType).endElement();
      if(result.stateId)
        receiver = receiver.startElement(stateId).addText(result.stateId.toString()).endElement();
      if(result.electionAdminId)
        receiver = receiver.startElement(electionAdminId).addText(result.electionAdminId.toString()).endElement();
      if(result.earlyVoteSiteIds.length) {
        result.earlyVoteSiteIds.forEach(function(ids) {
          receiver = receiver.startElement(earlyVoteSiteId).addText(ids.toString()).endElement();
        });
      }

      receiver = receiver.endElement();
    });

    console.log('locality finished');
    callback();
  });
}

exports.localityExport = localityExport;