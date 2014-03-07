/**
 * Created by rcartier13 on 3/4/14.
 */

var genx = require('genx');

function addressExport(receiver, writer, namespace, addrElement, address) {
  var locationName = writer.declareElement(namespace, 'location_name');
  var line1 = writer.declareElement(namespace, 'line1');
  var line2 = writer.declareElement(namespace, 'line2');
  var line3 = writer.declareElement(namespace, 'line3');
  var city = writer.declareElement(namespace, 'city');
  var state = writer.declareElement(namespace, 'state');
  var zip = writer.declareElement(namespace, 'zip');

  receiver = receiver.startElement(addrElement)
  if(address.locationName)
    receiver = receiver.startElement(locationName).addText(address.locationName).endElement();
  if(address.line1)
    receiver = receiver.startElement(line1).addText(address.line1).endElement();
  if(address.line2)
    receiver = receiver.startElement(line2).addText(address.line2).endElement();
  if(address.line3)
    receiver = receiver.startElement(line3).addText(address.line3).endElement();
  if(address.city)
    receiver = receiver.startElement(city).addText(address.city).endElement();
  if(address.state)
    receiver = receiver.startElement(state).addText(address.state).endElement();
  if(address.zip)
    receiver = receiver.startElement(zip).addText(address.zip).endElement();
  receiver = receiver.endElement();
}

exports.addressExport = addressExport;