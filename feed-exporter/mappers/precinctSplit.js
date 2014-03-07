/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function precinctSplitExport(feedId, callback) {
  schemas.models.PrecinctSplit.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('precinct_split', 'id', result.elementId.toString());

      if(result.name)
        chunk += util.startEndElement('name', result.name);
      if(result.precinctId)
        chunk += util.startEndElement('precinct_id', result.precinctId);
      if(result.electoralDistrictIds.length) {
        result.electoralDistrictIds.forEach(function(ids) {
          chunk += util.startEndElement('electoral_district_id', ids.toString());
        });
      }
      if(result.pollingLocationIds.length) {
        result.pollingLocationIds.forEach(function(ids) {
          chunk += util.startEndElement('polling_location_id', ids.toString());
        });
      }
      if(result.ballotStyleImageUrl)
        chunk += util.startEndElement('ballot_style_image_url', result.ballotStyleImageUrl);

      chunk += util.endElement('precinct_split');
      callback(chunk);
    });

    console.log('precinct split finished');
  });
}

exports.precinctSplitExport = precinctSplitExport;