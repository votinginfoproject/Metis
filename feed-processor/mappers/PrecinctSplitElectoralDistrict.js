/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctSplitElectoralDistrict = function (models, feedId) {
    basemapper.call(this, models, feedId, models.PrecinctSplitElectoralDistrict);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctSplitElectoralDistrict, basemapper);

PrecinctSplitElectoralDistrict.prototype.mapCsv = function (precinctSplitElectoralDistrict) {
  this.model = {
    precinctSplitId: precinctSplitElectoralDistrict.precinct_split_id,
    electoralDistrictId: precinctSplitElectoralDistrict.electoral_district_id,
    _feed: this.feedId
  };
};

module.exports = PrecinctSplitElectoralDistrict;