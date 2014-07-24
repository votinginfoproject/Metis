/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  types = require('mongoose').Types,
  PollingLocation = function (models, feedId) {
    basemapper.call(this, models, feedId, models.pollinglocations);
  };
util.inherits(PollingLocation, basemapper);

PollingLocation.prototype.mapXml3_0 = function (pollingLocation) {
  this.model = new this.models.pollinglocations({
    elementId: pollingLocation.$.id,     //required
    address: this.mapSimpleAddress(pollingLocation.address),
    directions: pollingLocation.directions,
    pollingHours: pollingLocation.polling_hours,
    photoUrl: pollingLocation.photo_url,
    _feed: this.feedId
  });
};

PollingLocation.prototype.mapXml5_0 = function (pollingLocation) {
  this.version = "v5";

  this.model = new this.models.pollinglocations({
    elementId: pollingLocation.$.id,     //required
    address: this.mapSimpleAddress(pollingLocation.address),
    directions: pollingLocation.directions,
    pollingHours: pollingLocation.polling_hours,
    photoUrl: pollingLocation.photo_url,
    name: pollingLocation.name,
    _feed: this.feedId
  });
};

PollingLocation.prototype.mapCsv = function (pollingLocation) {
  this.model = new this.models.pollinglocations({
    elementId: pollingLocation.id,     //required
    address: {
      locationName: pollingLocation.address_location_name,
      line1: pollingLocation.address_line1,
      line2: pollingLocation.address_line2,
      line3: pollingLocation.address_line3,
      city: pollingLocation.address_city,
      state: pollingLocation.address_state,
      zip: pollingLocation.address_zip
    },
    directions: pollingLocation.directions,
    pollingHours: pollingLocation.polling_hours,
    photoUrl: pollingLocation.photo_url,
    _feed: this.feedId
  });
};


module.exports = PollingLocation;
