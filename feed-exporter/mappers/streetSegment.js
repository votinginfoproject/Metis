/**
 * Created by rcartier13 on 3/5/14.
 */

var schemas = require('../../dao/schemas');

function streetSegmentExport(feedId, writer, receiver, namespace, callback) {
  schemas.models.StreetSegment.find({_feed: feedId}, function(err, results) {
    var streetSegment = writer.declareElement(namespace, 'street_segment');
    var startHouseNumber = writer.declareElement(namespace, 'start_house_number');
    var endHouseNumber = writer.declareElement(namespace, 'end_house_number');
    var oddEvenBoth = writer.declareElement(namespace, 'odd_even_both');
    var startApartmentNumber = writer.declareElement(namespace, 'start_apartment_number');
    var nonHouseAddress = writer.declareElement(namespace, 'non_house_address');
      var houseNumber = writer.declareElement(namespace, 'house_number');
      var houseNumberPrefix = writer.declareElement(namespace, 'house_number_prefix');
      var houseNumberSuffix = writer.declareElement(namespace, 'house_number_suffix');
      var streetDirection = writer.declareElement(namespace, 'street_direction');
      var streetName = writer.declareElement(namespace, 'street_name');
      var streetSuffix = writer.declareElement(namespace, 'street_suffix');
      var addressDirection = writer.declareElement(namespace, 'address_direction');
      var apartment = writer.declareElement(namespace, 'apartment');
      var city = writer.declareElement(namespace, 'city');
      var state = writer.declareElement(namespace, 'state');
      var zip = writer.declareElement(namespace, 'zip');
    var precinctId = writer.declareElement(namespace, 'precinct_id');
    var precinctSplitId = writer.declareElement(namespace, 'precinct_split_id');

    var idAttr = writer.declareAttribute('id');

    if(!results.length)
      return;

    results.forEach(function(result) {
      receiver = receiver.startElement(streetSegment).addAttribute(idAttr, result.elementId.toString());

      if(result.startHouseNumber)
        receiver = receiver.startElement(startHouseNumber).addText(result.startHouseNumber.toString()).endElement();
      if(result.endHouseNumber)
        receiver = receiver.startElement(endHouseNumber).addText(result.endHouseNumber.toString()).endElement();
      if(result.oddEvenBoth)
        receiver = receiver.startElement(oddEvenBoth).addText(result.oddEvenBoth).endElement();
      if(result.startApartmentNumber)
        receiver = receiver.startElement(startApartmentNumber).addText(result.startApartmentNumber).endElement();
      if(result.nonHouseAddress) {
        receiver = receiver.startElement(nonHouseAddress);
        var address = result.nonHouseAddress;
        if(address.houseNumber)
          receiver = receiver.startElement(houseNumber).addText(address.houseNumber.toElement()).endElement();
        if(address.houseNumberPrefix)
          receiver = receiver.startElement(houseNumberPrefix).addText(address.houseNumberPrefix).endElement();
        if(address.houseNumberSuffix)
          receiver = receiver.startElement(houseNumberSuffix).addText(address.houseNumberSuffix).endElement();
        if(address.streetDirection)
          receiver = receiver.startElement(streetDirection).addText(address.streetDirection).endElement();
        if(address.streetName)
          receiver = receiver.startElement(streetName).addText(address.streetName).endElement();
        if(address.streetSuffix)
          receiver = receiver.startElement(streetSuffix).addText(address.streetSuffix).endElement();
        if(address.addressDirection)
          receiver = receiver.startElement(addressDirection).addText(address.addressDirection).endElement();
        if(address.apartment)
          receiver = receiver.startElement(apartment).addText(address.apartment).endElement();
        if(address.city)
          receiver = receiver.startElement(city).addText(address.city).endElement();
        if(address.state)
          receiver = receiver.startElement(state).addText(address.state).endElement();
        if(address.zip)
          receiver = receiver.startElement(zip).addText(address.zip).endElement();

        receiver = receiver.endElement();
      }
      if(result.precinctId)
        receiver = receiver.startElement(precinctId).addText(result.precinctId.toString()).endElement();
      if(result.precinctSplitId)
        receiver = receiver.startElement(precinctSplitId).addText(result.precinctSplitId.toString()).endElement();

      receiver = receiver.endElement();
    });

    console.log('street segment finished');
    callback();
  });
}

exports.streetSegmentExport = streetSegmentExport;