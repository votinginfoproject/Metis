/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  ElectoralDistrict = function (models, feedId) {
    basemapper.call(this, models, feedId, models.electoralDistricts);
  };
util.inherits(ElectoralDistrict, basemapper);

ElectoralDistrict.prototype.mapXml3_0 = function (electoralDistrict) {
  this.model = new this.models.electoralDistricts({
    elementId: electoralDistrict.$.id,     //required
    name: electoralDistrict.name,
    type: electoralDistrict.type,
    number: electoralDistrict.number,
    _feed: this.feedId
  });
};

ElectoralDistrict.prototype.mapXml5_0 = function (electoralDistrict) {
  this.version = "v5";

  this.model = new this.models.electoralDistricts({
    elementId: electoralDistrict.$.id,     //required
    name: electoralDistrict.name,
    type: electoralDistrict.type,
    number: electoralDistrict.number,
    description: electoralDistrict.description,
    _feed: this.feedId
  });
};

ElectoralDistrict.prototype.mapCsv = function (electoralDistrict) {
  this.model = new this.models.electoralDistricts({
    elementId: electoralDistrict.id,     //required
    name: electoralDistrict.name,
    type: electoralDistrict.type,
    number: electoralDistrict.number,
    _feed: this.feedId
  });
};


module.exports = ElectoralDistrict;
