/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  EarlyVoteSite = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(EarlyVoteSite, basemapper);

EarlyVoteSite.prototype.mapXml3_0 = function (earlyVoteSite) {
  this.model = new this.models.EarlyVoteSite({
    elementId: earlyVoteSite.$.id,     //required
    name: earlyVoteSite.name,
    address: this.mapSimpleAddress(earlyVoteSite.address),
    directions: earlyVoteSite.directions,
    voterServices: earlyVoteSite.voter_services,
    startDate: earlyVoteSite.start_date,
    endDate: earlyVoteSite.end_date,
    daysTimesOpen: earlyVoteSite.days_times_open,
    _feed: this.feedId
  });
};

EarlyVoteSite.prototype.mapXml5_0 = function (earlyVoteSite) {

};

EarlyVoteSite.prototype.mapCsv = function (earlyVoteSite) {

};


module.exports = EarlyVoteSite;
