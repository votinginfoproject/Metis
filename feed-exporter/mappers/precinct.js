/**
 * Created by rcartier13 on 3/4/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function precinctExport(feedId, callback) {
  schemas.models.Precinct.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('precinct', 'id', _.escape(result.elementId.toString()), null, null);

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.number)
        chunk += util.startEndElement('number', _.escape(result.number));
      if(result.ward)
        chunk += util.startEndElement('ward', _.escape(result.ward.toString()));
      if(result.mailOnly != undefined && result.mailOnly != null)
        chunk += util.startEndElement('mail_only', result.mailOnly ? 'yes' : 'no');
      if(result.ballotStyleImageUrl)
        chunk += util.startEndElement('ballot_style_image_image', _.escape(result.ballotStyleImageUrl));
      if(result.localityId)
        chunk += util.startEndElement('locality_id', _.escape(result.localityId.toString()));
      if(result.electoralDistrictIds.length) {
        result.electoralDistrictIds.forEach(function(ids) {
          chunk += util.startEndElement('electoral_district_id', _.escape(ids.toString()));
        });
      }
      if(result.pollingLocationIds.length) {
        result.pollingLocationIds.forEach(function(ids) {
          chunk += util.startEndElement('polling_location_id', _.escape(ids.toString()));
        });
      }
      if(result.earlyVoteSiteIds.length) {
        result.earlyVoteSiteIds.forEach(function(ids) {
          chunk += util.startEndElement('early_vote_site_id', _.escape(ids.toString()));
        });
      }

      chunk += util.endElement('precinct');
      callback(pd.xml(chunk));
    });

    console.log('precinct finished');
  });
}

exports.precinctExport = precinctExport;