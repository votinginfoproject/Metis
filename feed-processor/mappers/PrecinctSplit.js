/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  types = require('mongoose').Types,
  PrecinctSplit = function (models, feedId) {
    basemapper.call(this, models, feedId, 'PrecinctSplit');
  };
util.inherits(PrecinctSplit, basemapper);

PrecinctSplit.prototype.mapXml3_0 = function (precinctSplit) {
  this.model = new this.models.PrecinctSplit({
    _id: types.ObjectId(),
    elementId: precinctSplit.$.id,     //required
    name: precinctSplit.name,
    precinctId: precinctSplit.precinct_id,
    electoralDistrictIds: precinctSplit.electoral_district_id,
    pollingLocationIds: precinctSplit.polling_location_id,
    ballotStyleImageUrl: precinctSplit.ballot_style_image_url,
    _feed: this.feedId
  });
};

PrecinctSplit.prototype.mapXml5_0 = function (precinctSplit) {
  this.version = "v5";

  this.mapXml3_0(precinctSplit);
};

PrecinctSplit.prototype.mapCsv = function (precinctSplit) {
  this.model = new this.models.PrecinctSplit({
    elementId: precinctSplit.id,     //required
    name: precinctSplit.name,
    precinctId: precinctSplit.precinct_id,
    electoralDistrictIds: precinctSplit.electoral_district_id,
    pollingLocationIds: precinctSplit.polling_location_id,
    ballotStyleImageUrl: precinctSplit.ballot_style_image_url,
    _feed: this.feedId
  });

};


module.exports = PrecinctSplit;
