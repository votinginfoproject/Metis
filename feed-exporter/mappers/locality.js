/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');

function localityExport(feedId, callback) {

  schemas.models.Locality.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('locality', 'id', _.escape(result.elementId.toString()));

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.type)
        chunk += util.startEndElement('type', _.escape(result.type));
      if(result.electionMachineType)
        chunk += util.startEndElement('election_machine_type', _.escape(result.electionMachineType));
      if(result.pollBookType)
        chunk += util.startEndElement('poll_book_type', _.escape(result.pollBookType));
      if(result.stateId)
        chunk += util.startEndElement('state_id', _.escape(result.stateId.toString()));
      if(result.electionAdminId)
        chunk += util.startEndElement('election_administration_id', _.escape(result.electionAdminId.toString()));
      if(result.earlyVoteSiteIds.length) {
        result.earlyVoteSiteIds.forEach(function(ids) {
          chunk += util.startEndElement('early_vote_site_id', _.escape(ids.toString()));
        });
      }

      chunk += util.endElement('locality');
      callback(chunk);
    });

    console.log('locality finished');
  });
}

exports.localityExport = localityExport;