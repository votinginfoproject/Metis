/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');

function ballotExport(feedId, callback) {
  schemas.models.Ballot.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    var chunk = "";

    results.forEach(function(result) {
      chunk = util.startElement("ballot", "id", _.escape(result.elementId.toString()), null, null);

      if(result.referendumIds.length) {
        result.referendumIds.forEach(function(refId) {
          chunk += util.startEndElement("referendum_id", _.escape(refId.toString()));
        });
      }
      if(result.candidates.length) {
        result.candidates.forEach(function(candidate) {
          chunk += util.startEndElement("candidate_id", _.escape(candidate.elementId.toString()));
        });
      }
      if(result.customBallotId)
        chunk += util.startEndElement("custom_ballot_id", _.escape(result.customBallotId.toString()));
      if(result.writeIn != undefined && result.writeIn != null)
        chunk += util.startEndElement("write_in", result.writeIn ? 'yes' : 'no');
      if(result.imageUrl)
        chunk += util.startEndElement("image_url", _.escape(result.imageUrl));

      chunk += util.endElement("ballot");
      callback(chunk);
    });

    console.log('ballot finished');
  });
}

exports.ballotExport = ballotExport;