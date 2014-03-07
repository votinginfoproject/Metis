/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var addrEx = require('./address');

function pollingLocationExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.PollingLocation.find({_feed: feedId}, function(err, results) {
    var pollingLocation = writer.declareElement(namespace, 'polling_location');
    var address = writer.declareElement(namespace, 'address');
    var directions = writer.declareElement(namespace, 'directions');
    var pollingHours = writer.declareElement(namespace, 'polling_hours');
    var photoUrl = writer.declareElement(namespace, 'photo_url');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(pollingLocation).addAttribute(idAttr, result.elementId.toString());

      if(result.address)
        addrEx.addressExport(receiver, writer, namespace, address, result.address);
      if(result.directions)
        receiver = receiver.startElement(directions).addText(result.directions).endElement();
      if(result.pollingHours)
        receiver = receiver.startElement(pollingHours).addText(result.pollingHours).endElement();
      if(result.photoUrl)
        receiver = receiver.startElement(photoUrl).addText(result.photoUrl).endElement();

      receiver = receiver.endElement();
    });

    console.log('polling location finished');
    callback();
  });
}

exports.pollingLocationExport = pollingLocationExport;