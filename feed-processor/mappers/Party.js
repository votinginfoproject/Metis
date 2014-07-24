/**
 * Created by rcartier13 on 4/22/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Party = function (models, feedId) {
    basemapper.call(this, models, feedId, models.parties);
  };
util.inherits(Party, basemapper);

Party.prototype.mapXml5_0 = function (party) {
  this.version = "v5";

  this.model = new this.models.parties({
    elementId: party.$.id,
    name: party.name,
    majorParty: party.major_party,
    abbreviation: party.abbreviation,
    initial: party.initial,
    sortOrder: party.$.sort_order,
    _feed: this.feedId
  });
};

module.exports = Party;