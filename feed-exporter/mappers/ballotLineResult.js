/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');

function ballotLineResultExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.BallotLineResult.find({_feed: feedId}, function(err, results) {
    var ballotLineResult = writer.declareElement(namespace, 'ballot_line_result');
    var contestId = writer.declareElement(namespace, 'contest_id');
    var jurisdictionId = writer.declareElement(namespace, 'jurisdiction_id');
    var entireDistrict = writer.declareElement(namespace, 'entire_district');
    var candidateId = writer.declareElement(namespace, 'candidate_id');
    var ballotResponseId = writer.declareElement(namespace, 'ballot_response_id');
    var votes = writer.declareElement(namespace, 'votes');
    var victorious = writer.declareElement(namespace, 'victorious');

    var certification = writer.declareAttribute('certification');
    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(ballotLineResult).addAttribute(idAttr, result.elementId.toString()).addAttribute(certification, result.certification);

      if(result.contestId)
        receiver = receiver.startElement(contestId).addText(result.contestId.toString()).endElement();
      if(result.jurisdictionId)
        receiver = receiver.startElement(jurisdictionId).addText(result.jurisdictionId.toString()).endElement();
      if(result.entireDistrict != undefined && result.entireDistrict != null)
        receiver = receiver.startElement(entireDistrict).addText(result.entireDistrict ? 'yes' : 'no').endElement();
      if(result.candidateId)
        receiver = receiver.startElement(candidateId).addText(result.candidateId.toString()).endElement();
      if(result.ballotResponseId)
        receiver = receiver.startElement(ballotResponseId).addText(result.ballotResponseId.toString()).endElement();
      if(result.votes)
        receiver = receiver.startElement(votes).addText(result.votes.toString()).endElement();
      if(result.victorious != undefined && result.entireDistrict != null)
        receiver = receiver.startElement(victorious).addText(result.victorious ? 'yes' : 'no').endElement();

      receiver = receiver.endElement();
    });

    console.log('ballot line result finished');
    callback();
  });
}

exports.ballotLineResultExport = ballotLineResultExport;