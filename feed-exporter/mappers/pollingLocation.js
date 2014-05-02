/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');
var util = require('./util');
var _ = require('underscore');
var pd = require('pretty-data').pd;

function pollingLocationExport(feedId, callback) {
  schemas.models.pollingLocations.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('polling_location', 'id', _.escape(result.elementId.toString()));

      if(util.testEmptyObject(result.address))
        chunk += addrEx.addressExport('address', result.address);
      if(result.directions)
        chunk += util.startEndElement('directions', _.escape(result.directions));
      if(result.pollingHours)
        chunk += util.startEndElement('polling_hours', _.escape(result.pollingHours));
      if(result.photoUrl)
        chunk += util.startEndElement('photo_url', _.escape(result.photoUrl));

      chunk += util.endElement('polling_location');
      callback(pd.xml(chunk));
    });

    console.log('polling location finished');
  });
}

exports.pollingLocationExport = pollingLocationExport;