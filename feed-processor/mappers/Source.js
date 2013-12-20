/**
 * Created by bantonides on 12/19/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  Source = function (models, feedId) {
    basemapper.call(this, models, feedId);
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
    _feed: this.feedId
  });
};

Source.prototype.mapXml5_0 = function (source) {

};

Source.prototype.mapCsv = function (source) {

};


module.exports = Source;

