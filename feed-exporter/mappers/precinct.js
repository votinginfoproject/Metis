/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');
var schemas = require('../../dao/schemas');

function precinctExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.Precinct.find({_feed: feedId}, function(err, results) {
    var precinct = writer.declareElement(namespace, 'precinct');
    var name = writer.declareElement(namespace, 'name');
    var number = writer.declareElement(namespace, 'number');
    var ward = writer.declareElement(namespace, 'ward');
    var mailOnly = writer.declareElement(namespace, 'mail_only');
    var ballotImage = writer.declareElement(namespace, 'ballot_style_image_url');
    var localityId = writer.declareElement(namespace, 'locality_id');
    var electoralDistrictId = writer.declareElement(namespace, 'electoral_district_id');
    var pollingLocationId = writer.declareElement(namespace, 'polling_location_id');
    var earlyVoteSiteId = writer.declareElement(namespace, 'early_vote_site_id');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(precinct).addAttribute(idAttr, result.elementId.toString());

      if(result.name)
        receiver = receiver.startElement(name).addText(result.name).endElement();
      if(result.number)
        receiver = receiver.startElement(number).addText(result.number.toString()).endElement();
      if(result.ward)
        receiver = receiver.startElement(ward).addText(result.ward.toString()).endElement();
      if(result.mailOnly != undefined && result.mailOnly != null)
        receiver = receiver.startElement(mailOnly).addText(result.mailOnly ? 'yes' : 'no').endElement();
      if(result.ballotStyleImageUrl)
        receiver = receiver.startElement(ballotImage).addText(result.ballotStyleImageUrl).endElement();
      if(result.localityId)
        receiver = receiver.startElement(localityId).addText(result.localityId.toString()).endElement();
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
      if(result.earlyVoteSiteIds.length) {
        result.earlyVoteSiteIds.forEach(function(ids) {
          receiver = receiver.startElement(earlyVoteSiteId).addText(ids.toString()).endElement();
        });
      }

      receiver = receiver.endElement();
    });

    console.log('precinct finished');
    callback();
  });
}

exports.precinctExport = precinctExport;