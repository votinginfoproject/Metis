/**
 * Created by bantonides on 12/30/13.
 */
const
  basemapper = require('./BaseMapper'),
  util = require('util'),
  Candidate = function (models, feedId) {
    basemapper.call(this, models, feedId);
  };
util.inherits(Candidate, basemapper);

Candidate.prototype.mapXml3_0 = function (candidate) {
  this.model = new this.models.Candidate({
    elementId: candidate.$.id,     //required
    name: candidate.name,
    party: candidate.party,
    candidateUrl: candidate.candidate_url,
    biography: candidate.biography,
    phone: candidate.phone,
    photoUrl: candidate.photo_url,
    filedMailingAddress: this.mapSimpleAddress(candidate.filed_mailing_address),
    email: candidate.email,
    sortOrder: candidate.sort_order,
    _feed: this.feedId
  });
};

Candidate.prototype.mapXml5_0 = function (candidate) {

};

Candidate.prototype.mapCsv = function (candidate) {

};


module.exports = Candidate;
