/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  StreetSegment = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(StreetSegment, basemapper);

StreetSegment.prototype.mapXml3_0 = function (streetSegment) {
  this.model = new this.models.StreetSegment({
    elementId: streetSegment.$.id,     //required
    startHouseNumber: streetSegment.start_house_number,
    endHouseNumber: streetSegment.end_house_number,
    oddEvenBoth: streetSegment.odd_even_both,
    startApartmentNumber: streetSegment.start_apartment_number,
    endApartmentNumber: streetSegment.end_apartment_number,
    nonHouseAddress: {
      houseNumber: streetSegment.non_house_address.house_number,
      houseNumberPrefix: streetSegment.non_house_address.house_number_prefix,
      houseNumberSuffix: streetSegment.non_house_address.house_number_suffix,
      streetDirection: streetSegment.non_house_address.street_direction,
      streetName: streetSegment.non_house_address.street_name,
      streetSuffix: streetSegment.non_house_address.street_suffix,
      addressDirection: streetSegment.non_house_address.address_direction,
      apartment: streetSegment.non_house_address.apartment,
      city: streetSegment.non_house_address.city,
      state: streetSegment.non_house_address.state,
      zip: streetSegment.non_house_address.zip
    },
    precinctId: streetSegment.precinct_id,
    precinctSplitId: streetSegment.precinct_split_id,
    _feed: this.feedId
  });
};

StreetSegment.prototype.mapXml5_0 = function (streetSegment) {

};

StreetSegment.prototype.mapCsv = function (streetSegment) {
  this.model = new this.models.StreetSegment({
    elementId: streetSegment.id,     //required
    startHouseNumber: streetSegment.start_house_number,
    endHouseNumber: streetSegment.end_house_number,
    oddEvenBoth: streetSegment.odd_even_both,
    startApartmentNumber: streetSegment.start_apartment_number,
    endApartmentNumber: streetSegment.end_apartment_number,
    nonHouseAddress: {
      houseNumber: streetSegment.non_house_address_house_number,
      houseNumberPrefix: streetSegment.non_house_address_house_number_prefix,
      houseNumberSuffix: streetSegment.non_house_address_house_number_suffix,
      streetDirection: streetSegment.non_house_address_street_direction,
      streetName: streetSegment.non_house_address_street_name,
      streetSuffix: streetSegment.non_house_address_street_suffix,
      addressDirection: streetSegment.non_house_address_address_direction,
      apartment: streetSegment.non_house_address_apartment,
      city: streetSegment.non_house_address_city,
      state: streetSegment.non_house_address_state,
      zip: streetSegment.non_house_address_zip
    },
    precinctId: streetSegment.precinct_id,
    precinctSplitId: streetSegment.precinct_split_id,
    _feed: this.feedId
  });
};


module.exports = StreetSegment;
