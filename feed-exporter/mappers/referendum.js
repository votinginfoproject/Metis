/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function referendumExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.Referendum.find({_feed: feedId}, function(err, results) {
    var referendum = writer.declareElement(namespace, 'referendum');
    var title = writer.declareElement(namespace, 'title');
    var subtitle = writer.declareElement(namespace, 'subtitle');
    var brief = writer.declareElement(namespace, 'brief');
    var text = writer.declareElement(namespace, 'text');
    var proStatement = writer.declareElement(namespace, 'pro_statement');
    var conStatement = writer.declareElement(namespace, 'con_statement');
    var passageThreshold = writer.declareElement(namespace, 'passage_threshold');
    var effectOfAbstain = writer.declareElement(namespace, 'effect_of_abstain');
    var ballotResponseId = writer.declareElement(namespace, 'ballot_response_id');

    var idAttr = writer.declareAttribute('id');
    var sortOrder = writer.declareAttribute('sort_order');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(referendum).addAttribute(idAttr, result.elementId.toString());

      if(result.title)
        receiver = receiver.startElement(title).addText(result.title).endElement();
      if(result.subtitle)
        receiver = receiver.startElement(subtitle).addText(result.subtitle).endElement();
      if(result.brief)
        receiver = receiver.startElement(brief).addText(result.brief).endElement();
      if(result.text)
        receiver = receiver.startElement(text).addText(result.text).endElement();
      if(result.proStatement)
        receiver = receiver.startElement(proStatement).addText(result.proStatement).endElement();
      if(result.conStatement)
        receiver = receiver.startElement(conStatement).addText(result.conStatement).endElement();
      if(result.passageThreshold)
        receiver = receiver.startElement(passageThreshold).addText(result.passageThreshold).endElement();
      if(result.effectOfAbstain)
        receiver = receiver.startElement(effectOfAbstain).addText(result.effectOfAbstain).endElement();
      if(result.ballotResponses.length) {
        result.ballotResponses.forEach(function(response) {
          receiver = receiver.startElement(ballotResponseId);
          if(response.sortOrder)
            receiver = receiver.addAttribute(sortOrder, response.sortOrder.toString());
          receiver = receiver.addText(response.elementId.toString()).endElement();
        });
      }
      receiver = receiver.endElement();
    });

    console.log('referendum finished');
    callback();
  });
}

exports.referendumExport = referendumExport;