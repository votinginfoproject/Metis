/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');
var moment = require('moment');
var util = require('./util');

function earlyVoteSitesExport(feedId, callback) {

  schemas.models.EarlyVoteSite.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('early_vote_site', 'id', result.elementId.toString());

      if(result.name)
        chunk += util.startEndElement('name', result.name);
      if(result.address)
        chunk += addrEx.addressExport('address', result.address);
      if(result.directions)
        chunk += util.startEndElement('directions', result.directions);
      if(result.voterServices)
        chunk += util.startEndElement('voter_services', result.voterServices);
      if(result.startDate)
        chunk += util.startEndElement('start_date', moment(result.startDate).utc().format('YYYY-MM-DD'));
      if(result.endDate)
        chunk += util.startEndElement('end_date', moment(result.endDate).utc().format('YYYY-MM-DD'));
      if(result.daysTimesOpen)
        chunk += util.startEndElement('days_times_open', '<![CDATA[' + result.daysTimesOpen + ']]>');

      chunk += util.endElement('early_vote_site');
      callback(chunk);
    });
  });

  console.log('early vote site finished');
}

exports.earlyVoteSitesExport = earlyVoteSitesExport;