/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');

function streetSegmentExport(feedId, callback) {
  schemas.models.StreetSegment.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement("street_segment", "id", result.elementId.toString(), null, null);

      if(result.startHouseNumber)
        chunk += util.startEndElement("start_house_number", result.startHouseNumber.toString());
      if(result.endHouseNumber)
        chunk += util.startEndElement("end_house_number", result.endHouseNumber.toString());
      if(result.oddEvenBoth)
        chunk += util.startEndElement("odd_even_both", result.oddEvenBoth);
      if(result.startApartmentNumber)
        chunk += util.startEndElement("start_apartment_number", result.startApartmentNumber);
      if(result.nonHouseAddress) {
        chunk += util.startElement("non_house_address", null, null, null, null);
        var address = result.nonHouseAddress;
        if(address.houseNumber)
          chunk += util.startEndElement("house_number", result.houseNumber);
        if(address.houseNumberPrefix)
          chunk += util.startEndElement("house_number_prefix", result.houseNumberPrefix);
        if(address.houseNumberSuffix)
          chunk += util.startEndElement("house_number_suffix", result.houseNumberSuffix);
        if(address.streetDirection)
          chunk += util.startEndElement("street_direction", result.streetDirection);
        if(address.streetName)
          chunk += util.startEndElement("street_name", result.streetName);
        if(address.streetSuffix)
          chunk += util.startEndElement("street_suffix", result.streetSuffix);
        if(address.addressDirection)
          chunk += util.startEndElement("address_direction", result.addressDirection);
        if(address.apartment)
          chunk += util.startEndElement("apartment", result.apartment);
        if(address.city)
          chunk += util.startEndElement("city", result.city);
        if(address.state)
          chunk += util.startEndElement("state", result.state);
        if(address.zip)
          chunk += util.startEndElement("zip", result.zip);

        chunk += util.endElement("non_house_address");
      }
      if(result.precinctId)
        chunk += util.startEndElement("precinct_id", result.precinctId.toString());
      if(result.precinctSplitId)
        chunk += util.startEndElement("precinct_split_id", result.precinctSplitId.toString());

      chunk += util.endElement("street_segment");
      callback(chunk);
    });

    console.log('street segment finished');
  });
}

exports.streetSegmentExport = streetSegmentExport;