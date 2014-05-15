/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;
var zlib = require('zlib');

function ballotExport(feedId, callback) {
  schemas.models.ballots.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    var chunk = "";

    results.forEach(function(result) {
      chunk = util.startElement("ballot", "id", _.escape(result.elementId.toString()), null, null);

      if(result.referendumIds.length) {
        result.referendumIds.forEach(function(ref) {
          if(ref.elementId)
            chunk += util.startEndElement("referendum_id", _.escape(ref.elementId.toString()));
        });
      }
      if(result.candidates.length) {
        result.candidates.forEach(function(candidate) {
          if(candidate)
            chunk += util.startEndElement("candidate_id", _.escape(candidate.elementId.toString()));
        });
      }
      if(result.customBallotId) {
        if(result.customBallotId.elementId)
          chunk += util.startEndElement("custom_ballot_id", _.escape(result.customBallotId.elementId.toString()));
      }
      if(result.writeIn != undefined && result.writeIn != null)
        chunk += util.startEndElement("write_in", result.writeIn ? 'yes' : 'no');
      if(result.imageUrl)
        chunk += util.startEndElement("image_url", _.escape(result.imageUrl));

      chunk += util.endElement("ballot");
      callback(pd.xml(chunk));
    });

    console.log('ballot finished');
  });
}

exports.ballotExport = ballotExport;