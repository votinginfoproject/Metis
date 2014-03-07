/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function customBallotExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.CustomBallot.find({_feed: feedId}, function(err, results) {
    var customBallot = writer.declareElement(namespace, 'custom_ballot');
    var heading = writer.declareElement(namespace, 'heading');
    var ballotResponseId = writer.declareElement(namespace, 'ballot_response_id');

    var idAttr = writer.declareAttribute('id');
    var sortOrder = writer.declareAttribute('sort_order');

    if(!results.length)
      return;

    receiver = results.forEach(function(result) {
      receiver = receiver.startElement(customBallot).addAttribute(idAttr, result.elementId.toString());

      if(result.heading)
        receiver = receiver.startElement(heading).addText(result.heading).endElement();
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

    console.log('custom ballot finished');
    callback();
  });
}

exports.customBallotExport = customBallotExport;