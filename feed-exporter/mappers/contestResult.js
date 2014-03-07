/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function contestResultExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.ContestResult.find({_feed: feedId}, function(err, results) {
    var contestResult = writer.declareElement(namespace, 'contest_result');
    var contestId = writer.declareElement(namespace, 'contest_id');
    var jurisdictionId = writer.declareElement(namespace, 'jurisdiction_id');
    var entireDistrict = writer.declareElement(namespace, 'entire_district');
    var totalVotes = writer.declareElement(namespace, 'total_votes');
    var totalValidVotes = writer.declareElement(namespace, 'total_valid_votes');
    var overvotes = writer.declareElement(namespace, 'overvotes');
    var blankVotes = writer.declareElement(namespace, 'blank_votes');
    var acceptedProvisionalVotes = writer.declareElement(namespace, 'accepted_provisional_votes');
    var rejectedVotes = writer.declareElement(namespace, 'rejected_votes');

    var certification = writer.declareAttribute('certification');
    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(contestResult).addAttribute(idAttr, result.elementId.toString()).addAttribute(certification, result.certification);

      if(result.contestId)
        receiver = receiver.startElement(contestId).addText(result.contestId.toString()).endElement();
      if(result.jurisdictionId)
        receiver = receiver.startElement(jurisdictionId).addText(result.jurisdictionId.toString()).endElement();
      if(result.entireDistrict != undefined && result.entireDistrict != null)
        receiver = receiver.startElement(entireDistrict).addText(result.entireDistrict ? 'yes' : 'no').endElement();
      if(result.totalVotes)
        receiver = receiver.startElement(totalVotes).addText(result.totalVotes.toString()).endElement();
      if(result.totalValidVotes)
        receiver = receiver.startElement(totalValidVotes).addText(result.totalValidVotes.toString()).endElement();
      if(result.overvotes)
        receiver = receiver.startElement(overvotes).addText(result.overvotes.toString()).endElement();
      if(result.blankVotes)
        receiver = receiver.startElement(blankVotes).addText(result.blankVotes.toString()).endElement();
      if(result.acceptedProvisionalVotes)
        receiver = receiver.startElement(acceptedProvisionalVotes).addText(result.acceptedProvisionalVotes.toString()).endElement();
      if(result.rejectedVotes)
        receiver = receiver.startElement(rejectedVotes).addText(result.rejectedVotes.toString()).endElement();

      receiver = receiver.endElement();
    });

    console.log('contest result finished');
    callback();
  });
}

exports.contestResultExport = contestResultExport;