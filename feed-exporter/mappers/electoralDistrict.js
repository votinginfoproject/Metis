/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var schemas = require('../../dao/schemas');

function electoralDistrictExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.ElectoralDistrict.find({_feed: feedId}, function(err, results) {
    var district = writer.declareElement(namespace, 'electoral_district');
    var name = writer.declareElement(namespace, 'name');
    var type = writer.declareElement(namespace, 'type');
    var number = writer.declareElement(namespace, 'number');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(district).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.type)
        receiver = receiver.startElement(type).addText(result.type).endElement();
      if(result.number)
        receiver = receiver.startElement(number).addText(result.number).endElement();

      receiver = receiver.endElement();
    });

    console.log('electoral district finished');
    callback();
  });
}

exports.electoralDistrictExport = electoralDistrictExport;