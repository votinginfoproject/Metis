/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function referendumExport(feedId, callback) {
  schemas.models.Referendum.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('referendum', 'id', result.elementId.toString());

      if(result.title)
        chunk += util.startEndElement('title', result.title);
      if(result.subtitle)
        chunk += util.startEndElement('subtitle', result.subtitle);
      if(result.brief)
        chunk += util.startEndElement('brief', result.brief);
      if(result.text)
        chunk += util.startEndElement('text', result.text);
      if(result.proStatement)
        chunk += util.startEndElement('pro_statement', result.proStatement);
      if(result.conStatement)
        chunk += util.startEndElement('con_statement', result.conStatement);
      if(result.passageThreshold)
        chunk += util.startEndElement('passage_threshold', result.passageThreshold);
      if(result.effectOfAbstain)
        chunk += util.startEndElement('effect_of_abstain', result.effectOfAbstain);
      if(result.ballotResponses.length) {
        result.ballotResponses.forEach(function(response) {
          chunk += util.startEndAttributeElement('ballot_response_id', 'sort_order', response.sortOrder ? response.sortOrder.toString() : null, response.elementId.toString());
        });
      }

      chunk += util.endElement('referendum');
      callback(chunk);
    });

    console.log('referendum finished');
  });
}

exports.referendumExport = referendumExport;