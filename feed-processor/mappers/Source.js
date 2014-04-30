/**
 * Created by bantonides on 12/19/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  when = require('when'),
  Source = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Source);
  };
util.inherits(Source, basemapper);

Source.prototype.mapXml3_0 = function (source) {
  this.model = new this.models.Source({
    elementId: source.$.id,
    vipId: source.vip_id,
    datetime: source.datetime,
    description: source.description,
    name: source.name,
    organizationUrl: source.organization_url,
    feedContactId: source.feed_contact_id,
    touUrl: source.tou_url,
    _feed: this.feedId
  });
};

Source.prototype.mapXml5_0 = function (source) {
  this.version = "v5";

  this.mapXml3_0(source);
};

Source.prototype.mapCsv = function (source) {
  this.model = new this.models.Source({
    elementId: source.id,
    vipId: source.vip_id,
    datetime: source.datetime,
    description: source.description,
    name: source.name,
    organizationUrl: source.organization_url,
    feedContactId: source.feed_contact_id,
    touUrl: source.tou_url,
    _feed: this.feedId
  });

};

Source.prototype.save = function () {
  if (this.model === undefined) {
    return;
  }

  return when.join(
    this.collection.create(this.model),
    this.models.Feed.findByIdAndUpdate(this.feedId, { $set: { fipsCode: this.model.vipId } }).exec());
}

module.exports = Source;

