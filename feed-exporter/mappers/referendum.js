/**
 * Created by rcartier13 on 3/5/14.
 */
var logger = (require('../../logging/vip-winston')).Logger;
var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function referendumExport(feedId, callback) {
  logger.info('Export Referendums Started');
  schemas.models.referendums.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('referendum', 'id', _.escape(result.elementId.toString()));

      if(result.title)
        chunk += util.startEndElement('title', _.escape(result.title));
      if(result.subtitle)
        chunk += util.startEndElement('subtitle', _.escape(result.subtitle));
      if(result.brief)
        chunk += util.startEndElement('brief', _.escape(result.brief));
      if(result.text)
        chunk += util.startEndElement('text', _.escape(result.text));
      if(result.proStatement)
        chunk += util.startEndElement('pro_statement', _.escape(result.proStatement));
      if(result.conStatement)
        chunk += util.startEndElement('con_statement', _.escape(result.conStatement));
      if(result.passageThreshold)
        chunk += util.startEndElement('passage_threshold', _.escape(result.passageThreshold));
      if(result.effectOfAbstain)
        chunk += util.startEndElement('effect_of_abstain', _.escape(result.effectOfAbstain));
      if(result.ballotResponses.length) {
        result.ballotResponses.forEach(function(response) {
          chunk += util.startEndAttributeElement('ballot_response_id', 'sort_order',
                response.sortOrder ? _.escape(response.sortOrder.toString()) : null, _.escape(response.elementId.toString()));
        });
      }

      chunk += util.endElement('referendum');
      callback(pd.xml(chunk));
    });

    logger.info('Export Referendum Finished');
    logger.info('----------------------------');
  });
}

exports.referendumExport = referendumExport;