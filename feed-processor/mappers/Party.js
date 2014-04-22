/**
 * Created by rcartier13 on 4/22/14.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Party = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Ballot);
  };
util.inherits(Party, basemapper);

Party.prototype.mapXml5_0 = function (party) {
  this.model = new this.models.Party({
    elementId: party.$.id,
    name: party.name,
    majorParty: party.major_party,
    abbreviation: party.abbreviation,
    initial: party.initial,
    sortOrder: party.$.sort_order
  });
};

module.exports = Party;