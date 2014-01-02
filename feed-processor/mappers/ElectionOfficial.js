/**
 * Created by bantonides on 12/27/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  ElectionOfficial = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(ElectionOfficial, basemapper);

ElectionOfficial.prototype.mapXml3_0 = function (official) {
  this.model = new this.models.ElectionOfficial({
    elementId: official.$.id,
    name: official.name,
    title: official.title,
    phone: official.phone,
    fax: official.fax,
    email: official.email,
    _feed: this.feedId
  });
};

ElectionOfficial.prototype.mapXml5_0 = function (official) {

};

ElectionOfficial.prototype.mapCsv = function (official) {

};


module.exports = ElectionOfficial;
