/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');

function electoralDistrictExport(feedId, callback) {
  schemas.models.ElectoralDistrict.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('electoral_district', 'id', _.escape(result.elementId.toString()));

      if(result.name)
        chunk += util.startEndElement('name', _.escape(result.name));
      if(result.type)
        chunk += util.startEndElement('type', _.escape(result.type));
      if(result.number)
        chunk += util.startEndElement('number', _.escape(result.number));

      chunk += util.endElement('electoral_district');
      callback(chunk);
    });

    console.log('electoral district finished');
  });
}

exports.electoralDistrictExport = electoralDistrictExport;