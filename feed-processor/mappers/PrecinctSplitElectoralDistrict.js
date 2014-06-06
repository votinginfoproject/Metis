/**
 * Created by bantonides on 3/12/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctSplitElectoralDistrict = function (models, feedId) {
    basemapper.call(this, models, feedId, models.precinctsplitelectoraldistrict);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctSplitElectoralDistrict, basemapper);

PrecinctSplitElectoralDistrict.prototype.mapXml5_0 = function (precinctSplitElectoralDistrict) {
  this.version = "v5";

  this.model = new this.models.precinctsplitelectoraldistrict({
    precinctSplitId: precinctSplitElectoralDistrict.precinct_split_id,
    precinctId: precinctSplitElectoralDistrict.precinct_id,
    electoralDistrictId: precinctSplitElectoralDistrict.electoral_district_id
  });
};

PrecinctSplitElectoralDistrict.prototype.mapCsv = function (precinctSplitElectoralDistrict) {
  this.model = {
    precinctSplitId: precinctSplitElectoralDistrict.precinct_split_id,
    electoralDistrictId: precinctSplitElectoralDistrict.electoral_district_id,
    _feed: this.feedId
  };
};

module.exports = PrecinctSplitElectoralDistrict;