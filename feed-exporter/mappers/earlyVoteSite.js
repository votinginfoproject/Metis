/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');
var moment = require('moment');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function earlyVoteSitesExport(feedId, callback) {

  schemas.models.earlyVoteSites.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('early_vote_site', 'id', _.escape(result.elementId.toString()));

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(util.testEmptyObject(result.address))
        chunk += addrEx.addressExport('address', result.address);
      if(result.directions)
        chunk += util.startEndElement('directions', _.escape(result.directions));
      if(result.voterServices)
        chunk += util.startEndElement('voter_services', _.escape(result.voterServices));
      if(result.startDate)
        chunk += util.startEndElement('start_date', _.escape(moment(result.startDate).utc().format('YYYY-MM-DD')));
      if(result.endDate)
        chunk += util.startEndElement('end_date', _.escape(moment(result.endDate).utc().format('YYYY-MM-DD')));
      if(result.daysTimesOpen)
        chunk += util.startEndElement('days_times_open', _.escape(result.daysTimesOpen));

      chunk += util.endElement('early_vote_site');
      callback(pd.xml(chunk));
    });
  });

  console.log('early vote site finished');
}

exports.earlyVoteSitesExport = earlyVoteSitesExport;