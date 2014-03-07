/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');

function ballotExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.Ballot.find({_feed: feedId}, function(err, results) {
    var ballot = writer.declareElement(namespace, 'ballot');
    var referendumId = writer.declareElement(namespace, 'referendum_id');
    var candidateId = writer.declareElement(namespace, 'candidate_id');
    var customBallotId = writer.declareElement(namespace, 'custom_ballot_id');
    var writeIn = writer.declareElement(namespace, 'write_in');
    var imageUrl = writer.declareElement(namespace, 'image_url');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(ballot).addAttribute(idAttr, result.elementId.toString())

      if(result.referendumIds.length) {
        result.referendumIds.forEach(function(refId) {
          receiver = receiver.startElement(referendumId).addText(refId.toString()).endElement();
        });
      }
      if(result.candidates.length) {
        result.candidates.forEach(function(candidate) {
          receiver = receiver.startElement(candidateId).addText(candidate.elementId.toString()).endElement();
        });
      }
      if(result.customBallotId)
        receiver = receiver.startElement(customBallotId).addText(result.customBallotId.toString()).endElement();
      if(result.writeIn != undefined && result.writeIn != null)
        receiver = receiver.startElement(writeIn).addText(result.writeIn ? 'yes' : 'no').endElement();
      if(result.imageUrl)
        receiver = receiver.startElement(imageUrl).addText(result.imageUrl).endElement();

      receiver = receiver.endElement();
    });

    console.log('ballot finished');
    callback();
  });
}

exports.ballotExport = ballotExport;