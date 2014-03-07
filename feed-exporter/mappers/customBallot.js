/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function customBallotExport(feedId, callback) {
  schemas.models.CustomBallot.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('custom_ballot', 'id', result.elementId.toString());

      if(result.heading)
        chunk += util.startEndElement('heading', result.heading);
      if(result.ballotResponses.length) {
        result.ballotResponses.forEach(function(response) {
          chunk += util.startEndAttributeElement('ballot_response_id', 'sort_order', response.sortOrder ? response.sortOrder.toString() : null, response.elementId.toString());
        });
      }

      chunk += util.endElement('custom_ballot');
      callback(chunk);
    });

    console.log('custom ballot finished');
  });
}

exports.customBallotExport = customBallotExport;