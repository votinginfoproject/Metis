/**
 * Created by bantonides on 3/11/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctPollingLocation = function (models, feedId) {
    basemapper.call(this, models, feedId, models.PrecinctPollingLocation);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctPollingLocation, basemapper);

PrecinctPollingLocation.prototype.mapCsv = function (precinctPollingLocation) {
  this.model = {
    precinctId: precinctPollingLocation.precinct_id,
    pollingLocationId: precinctPollingLocation.polling_location_id,
    _feed: this.feedId
  };
};

module.exports = PrecinctPollingLocation;