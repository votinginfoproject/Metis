/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function precinctSplitExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.PrecinctSplit.find({_feed: feedId}, function(err, results) {
    var split = writer.declareElement(namespace, 'precinct_split');
    var name = writer.declareElement(namespace, 'name');
    var precinctId = writer.declareElement(namespace, 'precinct_id');
    var electoralDistrictId = writer.declareElement(namespace, 'electoral_district_id');
    var pollingLocationId = writer.declareElement(namespace, 'polling_location_id');
    var ballotStyleImageUrl = writer.declareElement(namespace, 'ballot_style_image_url');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(split).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.precinctId)
        receiver = receiver.startElement(precinctId).addText(result.precinctId.toString()).endElement();
      if(result.electoralDistrictIds.length) {
        result.electoralDistrictIds.forEach(function(ids) {
          receiver = receiver.startElement(electoralDistrictId).addText(ids.toString()).endElement();
        });
      }
      if(result.pollingLocationIds.length) {
        result.pollingLocationIds.forEach(function(ids) {
          receiver = receiver.startElement(pollingLocationId).addText(ids.toString()).endElement();
        });
      }
      if(result.ballotStyleImageUrl)
        receiver = receiver.startElement(ballotStyleImageUrl).addText(result.ballotStyleImageUrl).endElement();

      receiver = receiver.endElement();
    });

    console.log('precinct split finished');
    callback();
  });
}

exports.precinctSplitExport = precinctSplitExport;