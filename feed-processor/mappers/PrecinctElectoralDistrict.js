/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctElectoralDistrict = function (models, feedId) {
    basemapper.call(this, models, feedId, models.precinctelectoraldistrict);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctElectoralDistrict, basemapper);

PrecinctElectoralDistrict.prototype.mapCsv = function (precinctElectoralDistrict) {
  this.model = {
    precinctId: precinctElectoralDistrict.precinct_id,
    electoralDistrictId: precinctElectoralDistrict.electoral_district_id,
    _feed: this.feedId
  };
};

module.exports = PrecinctElectoralDistrict;