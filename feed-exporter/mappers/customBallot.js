/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function customBallotExport(feedId, callback) {
  schemas.models.customballots.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('custom_ballot', 'id', _.escape(result.elementId.toString()));

      if(result.heading)
        chunk += util.startEndElement('heading', _.escape(result.heading));
      if(result.ballotResponses.length) {
        result.ballotResponses.forEach(function(response) {
          chunk += util.startEndAttributeElement('ballot_response_id', 'sort_order',
                response.sortOrder ? _.escape(response.sortOrder.toString()) : null, _.escape(response.elementId.toString()));
        });
      }

      chunk += util.endElement('custom_ballot');
      callback(pd.xml(chunk));
    });

    console.log('custom ballot finished');
  });
}

exports.customBallotExport = customBallotExport;