/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var attrEx = require('./address');
var util = require('./util');
var _ = require('underscore');

function electionAdminExport(feedId, callback) {
  schemas.models.ElectionAdmin.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('election_administration', 'id', _.escape(result.elementId.toString()));

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.eoId)
        chunk += util.startEndElement('eo_id', _.escape(result.eoId.toString()));
      if(result.ovcId)
        chunk += util.startEndElement('ovc_id', _.escape(result.ovcId.toString()));
      if(result.physicalAddress)
        chunk += attrEx.addressExport('physical_address', result.physicalAddress);
      if(result.mailingAddress)
        chunk += attrEx.addressExport('mailing_address', result.mailingAddress);
      if(result.electionsUrl)
        chunk += util.startEndElement('elections_url', _.escape(result.electionsUrl));
      if(result.registrationUrl)
        chunk += util.startEndElement('registration_url', _.escape(result.registrationUrl));
      if(result.amIRegisteredUrl)
        chunk += util.startEndElement('am_i_registered_url', _.escape(result.amIRegisteredUrl));
      if(result.absenteeUrl)
        chunk += util.startEndElement('absentee_url', _.escape(result.absenteeUrl));
      if(result.whereDoIVoteUrl)
        chunk += util.startEndElement('where_do_i_vote_url', _.escape(result.whereDoIVoteUrl));
      if(result.whatIsOnMyBallotUrl)
        chunk += util.startEndElement('what_is_on_my_ballot_url', _.escape(result.whatIsOnMyBallotUrl));
      if(result.rulesUrl)
        chunk += util.startEndElement('rules_url', _.escape(result.rulesUrl));
      if(result.voterServices)
        chunk += util.startEndElement('voter_services', _.escape(result.voterServices));
      if(result.hours)
        chunk += util.startEndElement('hours', _.escape(result.hours));

      chunk += util.endElement('election_administration');
      callback(chunk);
    });

    console.log('election admin finished');
  });
}

exports.electionAdminExport = electionAdminExport;