/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctSplit = function (models, feedId) {
    basemapper.call(this, models, feedId, models.PrecinctSplit);
  };
util.inherits(PrecinctSplit, basemapper);

PrecinctSplit.prototype.mapXml3_0 = function (precinctSplit) {
  this.model = new this.models.PrecinctSplit({
    elementId: this.convertId(precinctSplit.$.id),     //required
    name: precinctSplit.name,
    precinctId: this.convertId(precinctSplit.precinct_id),
    electoralDistrictIds: this.convertId(precinctSplit.electoral_district_id),
    pollingLocationIds: this.convertId(precinctSplit.polling_location_id),
    ballotStyleImageUrl: precinctSplit.ballot_style_image_url,
    _feed: this.feedId
  });
};

PrecinctSplit.prototype.mapXml5_0 = function (precinctSplit) {

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
