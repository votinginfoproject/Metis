/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var schemas = require('../../dao/schemas');
var util = require('./util');

function electoralDistrictExport(feedId, callback) {
  schemas.models.ElectoralDistrict.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement('electoral_district', 'id', result.elementId.toString());

      if(result.name)
        chunk += util.startEndElement('name', result.name);
      if(result.type)
        chunk += util.startEndElement('type', result.type);
      if(result.number)
        chunk += util.startEndElement('number', result.number);

      chunk += util.endElement('electoral_district');
      callback(chunk);
    });

    console.log('electoral district finished');
  });
}

exports.electoralDistrictExport = electoralDistrictExport;