/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function stateExport(feedId, callback) {
  schemas.models.State.findOne({_feed: feedId}, function(err, result) {

    if(!result) {
      callback(-1);
      return;
    }

    var chunk = util.startElement('state', 'id', result.elementId.toString());

    if(result.name)
      chunk += util.startEndElement('name', result.name);
    if(result.electionAdministrationId)
      chunk += util.startEndElement('election_administration_id', result.electionAdministrationId);
    if(result.earlyVoteSiteIds.length) {
      result.earlyVoteSiteIds.forEach(function(ids) {
        chunk += util.startEndElement('early_vote_site_id', ids.toString());
      })
    }

    chunk += util.endElement('state');
    console.log('state finished');
    callback(chunk)
  });
}

exports.stateExport = stateExport;