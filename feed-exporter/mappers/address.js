/**
 * Created by rcartier13 on 3/4/14.
 */

var util = require('./util');
var _ = require('underscore');

function addressExport(label, address) {

  var chunk = util.startElement(label, null, null, null, null);
  if(address.locationName)
    chunk += util.startEndElement('location_name', _.escape(address.locationName));
  if(address.line1)
    chunk += util.startEndElement('line1', _.escape(address.line1));
  if(address.line2)
    chunk += util.startEndElement('line2', _.escape(address.line2));
  if(address.line3)
    chunk += util.startEndElement('line3', _.escape(address.line3));
  if(address.city)
    chunk += util.startEndElement('city', _.escape(address.city));
  if(address.state)
    chunk += util.startEndElement('state', _.escape(address.state));
  if(address.zip)
    chunk += util.startEndElement('zip', _.escape(address.zip));

  chunk += util.endElement(label);
  return chunk;
}

exports.addressExport = addressExport;