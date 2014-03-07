/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function ballotResponseExport(feedId, callback) {
  schemas.models.BallotResponse.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {;
      var chunk = util.startElement('ballot_response', 'id', result.elementId.toString());

      if(result.text)
        chunk += util.startEndElement('text', result.text);
      if(result.sortOrder)
        chunk += util.startEndElement('text', result.sortOrder.toString());

      chunk += util.endElement('ballot_response');
      callback(chunk);
    });

    console.log('ballot response finished');
  });
}

exports.ballotResponseExport = ballotResponseExport;