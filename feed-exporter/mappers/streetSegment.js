/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');
var util = require('./util');
var _ = require('underscore');

function streetSegmentExport(feedId, callback) {
  schemas.models.StreetSegment.find({_feed: feedId}, function(err, results) {

    if(!results.length)
      callback(-1);

    results.forEach(function(result) {
      var chunk = util.startElement("street_segment", "id", _.escape(result.elementId.toString()), null, null);

      if(result.startHouseNumber)
        chunk += util.startEndElement("start_house_number", _.escape(result.startHouseNumber.toString()));
      if(result.endHouseNumber)
        chunk += util.startEndElement("end_house_number", _.escape(result.endHouseNumber.toString()));
      if(result.oddEvenBoth)
        chunk += util.startEndElement("odd_even_both", _.escape(result.oddEvenBoth));
      if(result.startApartmentNumber)
        chunk += util.startEndElement("start_apartment_number", _.escape(result.startApartmentNumber));
      if(result.nonHouseAddress) {
        chunk += util.startElement("non_house_address", null, null, null, null);
        var address = result.nonHouseAddress;
        if(address.houseNumber)
          chunk += util.startEndElement("house_number", _.escape(address.houseNumber));
        if(address.houseNumberPrefix)
          chunk += util.startEndElement("house_number_prefix", _.escape(address.houseNumberPrefix));
        if(address.houseNumberSuffix)
          chunk += util.startEndElement("house_number_suffix", _.escape(address.houseNumberSuffix));
        if(address.streetDirection)
          chunk += util.startEndElement("street_direction", _.escape(address.streetDirection));
        if(address.streetName)
          chunk += util.startEndElement("street_name", _.escape(address.streetName));
        if(address.streetSuffix)
          chunk += util.startEndElement("street_suffix", _.escape(address.streetSuffix));
        if(address.addressDirection)
          chunk += util.startEndElement("address_direction", _.escape(address.addressDirection));
        if(address.apartment)
          chunk += util.startEndElement("apartment", _.escape(address.apartment));
        if(address.city)
          chunk += util.startEndElement("city", _.escape(address.city));
        if(address.state)
          chunk += util.startEndElement("state", _.escape(address.state));
        if(address.zip)
          chunk += util.startEndElement("zip", _.escape(address.zip));

        chunk += util.endElement("non_house_address");
      }
      if(result.precinctId)
        chunk += util.startEndElement("precinct_id", _.escape(result.precinctId.toString()));
      if(result.precinctSplitId)
        chunk += util.startEndElement("precinct_split_id", _.escape(result.precinctSplitId.toString()));

      chunk += util.endElement("street_segment");
      callback(chunk);
    });

    console.log('street segment finished');
  });
}

exports.streetSegmentExport = streetSegmentExport;