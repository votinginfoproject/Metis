/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  _ = require('underscore'),
  Referendum = function (models, feedId) {
    basemapper.call(this, models, feedId, models.Referendum);
  };
util.inherits(Referendum, basemapper);

Referendum.prototype.mapXml3_0 = function (referendum) {
  this.model = new this.models.Referendum({
    elementId: referendum.$.id,     //required
    title: referendum.title,
    subtitle: referendum.subtitle,
    brief: referendum.brief,
    text: referendum.text,
    proStatement: referendum.pro_statement,
    conStatement: referendum.con_statement,
    passageThreshold: referendum.passage_threshold,
    effectOfAbstain: referendum.effect_of_abstain,
    ballotResponses: _.map(referendum.ballot_response_id, function(response) {
      return {
        elementId: (response.$text === undefined) ? response : response.$text,
        sortOrder: (response.$ === undefined) ? undefined : response.$.sort_order
      };
    }),
    _feed: this.feedId
  });
};

Referendum.prototype.mapXml5_0 = function (referendum) {
  this.model = new this.models.Referendum({
    elementId: referendum.$.id,     //required
    title: referendum.title,
    subtitle: referendum.subtitle,
    brief: referendum.brief,
    text: referendum.text,
    proStatement: referendum.pro_statement,
    conStatement: referendum.con_statement,
    passageThreshold: referendum.passage_threshold,
    effectOfAbstain: referendum.effect_of_abstain,
    ballotResponses: _.map(referendum.ballot_response_id, function(response) {
      return {
        elementId: (response.$text === undefined) ? response : response.$text,
        sortOrder: (response.$ === undefined) ? undefined : response.$.sort_order
      };
    }),
    electoralDistrictId: referendum.electoral_district_id,
    ballotPlacement: referendum.ballot_placement,
    _feed: this.feedId
  });
};

Referendum.prototype.mapCsv = function (referendum) {
  this.model = new this.models.Referendum({
    elementId: referendum.id,     //required
    title: referendum.title,
    subtitle: referendum.subtitle,
    brief: referendum.brief,
    text: referendum.text,
    proStatement: referendum.pro_statement,
    conStatement: referendum.con_statement,
    passageThreshold: referendum.passage_threshold,
    effectOfAbstain: referendum.effect_of_abstain,
    ballotResponses: _.map(referendum.ballot_response_id, function(response) {
      return {
        elementId: (response.$text === undefined) ? response : response.$text,
        sortOrder: (response.$ === undefined) ? undefined : response.$.sort_order
      };
    }),
    _feed: this.feedId
  });
};


module.exports = Referendum;
