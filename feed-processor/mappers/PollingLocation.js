/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PollingLocation = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(PollingLocation, basemapper);

PollingLocation.prototype.mapXml3_0 = function (pollingLocation) {
  this.model = new this.models.PollingLocation({
    elementId: pollingLocation.$.id,     //required
    address: {
      locationName: pollingLocation.location_name,
      line1: pollingLocation.line1,
      line2: pollingLocation.line2,
      line3: pollingLocation.line3,
      city: pollingLocation.city,
      state: pollingLocation.state,
      zip: pollingLocation.zip
    },
    directions: pollingLocation.directions,
    pollingHours: pollingLocation.polling_hours,
    photoUrl: pollingLocation.photo_url,
    _feed: this.feedId
  });
};

PollingLocation.prototype.mapXml5_0 = function (state) {

};

PollingLocation.prototype.mapCsv = function (state) {

};


module.exports = PollingLocation;
