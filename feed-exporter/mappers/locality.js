/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function localityExport(feedId, callback) {

  schemas.models.Locality.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('locality', 'id', result.elementId.toString());

      if(result.name)
        chunk += util.startEndElement('name', result.name);
      if(result.type)
        chunk += util.startEndElement('type', result.type);
      if(result.electionMachineType)
        chunk += util.startEndElement('election_machine_type', result.electionMachineType);
      if(result.pollBookType)
        chunk += util.startEndElement('poll_book_type', result.pollBookType);
      if(result.stateId)
        chunk += util.startEndElement('state_id', result.stateId.toString());
      if(result.electionAdminId)
        chunk += util.startEndElement('election_admin_id', result.electionAdminId.toString());
      if(result.earlyVoteSiteIds.length) {
        result.earlyVoteSiteIds.forEach(function(ids) {
          chunk += util.startEndElement('early_vote_site_id', ids.toString());
        });
      }

      chunk += util.endElement('locality');
      callback(chunk);
    });

    console.log('locality finished');
  });
}

exports.localityExport = localityExport;