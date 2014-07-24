/**
 * Created by rcartier13 on 4/22/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  PrecinctSplitBallotStyle = function (models, feedId) {
    basemapper.call(this, models, feedId, models.precinctsplitballotstyle);
    this.models = models;
    this.feedId = feedId;
  };
util.inherits(PrecinctSplitBallotStyle, basemapper);

PrecinctSplitBallotStyle.prototype.mapXml5_0 = function (precinctSplitBallotStyle) {
  this.version = "v5";

  this.model = new this.models.precinctsplitballotstyle({
    precinctSplitId: precinctSplitBallotStyle.precinct_split_id,
    precinctId: precinctSplitBallotStyle.precinct_id,
    ballotStyleId: precinctSplitBallotStyle.ballot_style_id
  });
};

module.exports = PrecinctSplitBallotStyle;