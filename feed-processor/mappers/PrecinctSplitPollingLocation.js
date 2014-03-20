/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctSplitPollingLocation = function (models, feedId) {
    basemapper.call(this, models, feedId, models.PrecinctSplitPollingLocation);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctSplitPollingLocation, basemapper);

PrecinctSplitPollingLocation.prototype.mapCsv = function (precinctSplitPollingLocation) {
  this.model = {
    precinctSplitId: precinctSplitPollingLocation.precinct_split_id,
    pollingLocationId: precinctSplitPollingLocation.polling_location_id,
    _feed: this.feedId
  };
};

module.exports = PrecinctSplitPollingLocation;