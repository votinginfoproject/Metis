/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var moment = require('moment');
var util = require('./util');

function contestExport(feedId, callback) {
  schemas.models.Contest.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('contest', 'id', result.elementId.toString(), null, null);

      if(result.type)
        chunk += util.startEndElement('type', result.type);
      if(result.partisan != undefined && result.partisan != null)
        chunk += util.startEndElement('partisan', result.partisan ? 'yes' : 'no');
      if(result.primaryParty)
        chunk += util.startEndElement('primary_party', result.primaryParty);
      if(result.electorateSpecifications)
        chunk += util.startEndElement('electorate_specifications', result.electorateSpecifications);
      if(result.special != undefined && result.special != null)
        chunk += util.startEndElement('special', result.special ? 'yes' : 'no');
      if(result.office)
        chunk += util.startEndElement('office', result.office);
      if(result.filingClosedDate)
        chunk += util.startEndElement('filing_date', moment(result.filingClosedDate).utc().format('YYYY-MM-DD'));
      if(result.numberElected)
        chunk += util.startEndElement('number_elected', result.numberElected.toString());
      if(result.numberVotingFor)
        chunk += util.startEndElement('number_voting_for', result.numberVotingFor.toString());
      if(result.ballotPlacement)
        chunk += util.startEndElement('ballot_placement', result.ballotPlacement.toString());
      if(result.electionId)
        chunk += util.startEndElement('election_id', result.electionId.toString());
      if(result.electoralDistrictId)
        chunk += util.startEndElement('electoral_district_id', result.electoralDistrictId.toString());
      if(result.ballotId)
        chunk += util.startEndElement('ballot_id', result.ballotId.toString());

      chunk += util.endElement('contest');
      callback(chunk);
    });

    console.log('contest finished');
  })
}

exports.contestExport = contestExport;