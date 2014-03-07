/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function ballotResponseExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.BallotResponse.find({_feed: feedId}, function(err, results) {
    var ballotResponse = writer.declareElement(namespace, 'ballot_response');
    var text = writer.declareElement(namespace, 'text');
    var sortOrder = writer.declareElement(namespace, 'sort_order');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(ballotResponse).addAttribute(idAttr, result.elementId.toString());

      if(result.text)
        receiver = receiver.startElement(text).addText(result.text).endElement();
      if(result.sortOrder)
        receiver = receiver.startElement(sortOrder).addText(result.sortOrder.toString()).endElement();

      receiver = receiver.endElement();
    });

    console.log('ballot response finished');
    callback();
  });
}

exports.ballotResponseExport = ballotResponseExport;