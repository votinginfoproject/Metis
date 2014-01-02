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
    address: this.mapSimpleAddress(pollingLocation.address),
    directions: pollingLocation.directions,
    pollingHours: pollingLocation.polling_hours,
    photoUrl: pollingLocation.photo_url,
    _feed: this.feedId
  });
};

PollingLocation.prototype.mapXml5_0 = function (pollingLocation) {

};

PollingLocation.prototype.mapCsv = function (pollingLocation) {

};


module.exports = PollingLocation;
