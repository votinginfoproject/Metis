/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function ballotResponseExport(feedId, callback) {
  schemas.models.ballotResponses.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {;
      var chunk = util.startElement('ballot_response', 'id', _.escape(result.elementId.toString()));

      if(result.text)
        chunk += util.startEndElement('text', _.escape(result.text));
      if(result.sortOrder)
        chunk += util.startEndElement('text', _.escape(result.sortOrder.toString()));

      chunk += util.endElement('ballot_response');
      callback(pd.xml(chunk));
    });

    console.log('ballot response finished');
  });
}

exports.ballotResponseExport = ballotResponseExport;