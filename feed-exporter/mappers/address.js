/**
 * Created by rcartier13 on 3/4/14.
 */

var util = require('./util');

function addressExport(label, address) {

  var chunk = util.startElement(label, null, null, null, null);
  if(address.locationName)
    chunk += util.startEndElement('location_name', address.locationName);
  if(address.line1)
    chunk += util.startEndElement('line1', address.line1);
  if(address.line2)
    chunk += util.startEndElement('line2', address.line2);
  if(address.line3)
    chunk += util.startEndElement('line3', address.line3);
  if(address.city)
    chunk += util.startEndElement('city', address.city);
  if(address.state)
    chunk += util.startEndElement('state', address.state);
  if(address.zip)
    chunk += util.startEndElement('zip', address.zip);

  chunk += util.endElement(label);
  return chunk;
}

exports.addressExport = addressExport;