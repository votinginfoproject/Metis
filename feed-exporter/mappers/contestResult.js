/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function contestResultExport(feedId, callback) {
  schemas.models.contestResults.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('contest_result', 'id', _.escape(result.elementId.toString()), 'certification', _.escape(result.certification));

      if(result.contestId)
        chunk += util.startEndElement('contest_id', _.escape(result.contestId.toString()));
      if(result.jurisdictionId)
        chunk += util.startEndElement('jurisdiction_id', _.escape(result.jurisdictionId.toString()));
      if(result.entireDistrict != undefined && result.entireDistrict != null)
        chunk += util.startEndElement('entire_district', result.entireDistrict ? 'yes' : 'no');
      if(result.totalVotes)
        chunk += util.startEndElement('total_votes', _.escape(result.totalVotes.toString()));
      if(result.totalValidVotes)
        chunk += util.startEndElement('total_valid_votes', _.escape(result.totalValidVotes.toString()));
      if(result.overvotes)
        chunk += util.startEndElement('overvotes', _.escape(result.overvotes.toString()));
      if(result.blankVotes)
        chunk += util.startEndElement('blank_votes', _.escape(result.blankVotes.toString()));
      if(result.acceptedProvisionalVotes)
        chunk += util.startEndElement('accepted_provisional_votes', _.escape(result.acceptedProvisionalVotes.toString()));
      if(result.rejectedVotes)
        chunk += util.startEndElement('rejected_votes', _.escape(result.rejectedVotes.toString()));

      chunk += util.endElement('contest_result');
      callback(pd.xml(chunk));
    });

    console.log('contest result finished');
  });
}

exports.contestResultExport = contestResultExport;