/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function contestResultExport(feedId, callback) {
  schemas.models.ContestResult.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('contest_result', 'id', result.elementId.toString(), 'certification', result.certification);

      if(result.contestId)
        chunk += util.startEndElement('contest_id', result.contestId.toString());
      if(result.jurisdictionId)
        chunk += util.startEndElement('jurisdiction_id', result.jurisdictionId.toString());
      if(result.entireDistrict != undefined && result.entireDistrict != null)
        chunk += util.startEndElement('entire_district', result.entireDistrict ? 'yes' : 'no');
      if(result.totalVotes)
        chunk += util.startEndElement('total_votes', result.totalVotes.toString());
      if(result.totalValidVotes)
        chunk += util.startEndElement('total_valid_votes', result.totalValidVotes.toString());
      if(result.overvotes)
        chunk += util.startEndElement('overvotes', result.overvotes.toString());
      if(result.blankVotes)
        chunk += util.startEndElement('blank_votes', result.blankVotes.toString());
      if(result.acceptedProvisionalVotes)
        chunk += util.startEndElement('accepted_provisional_votes', result.acceptedProvisionalVotes.toString());
      if(result.rejectedVotes)
        chunk += util.startEndElement('rejected_votes', result.rejectedVotes.toString());

      chunk += util.endElement('contest_result');
      callback(chunk);
    });

    console.log('contest result finished');
  });
}

exports.contestResultExport = contestResultExport;