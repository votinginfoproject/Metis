/**
 * Created by bantonides on 3/6/14.
 */
const
  mongoose = require('mongoose'),
  config = require('../config');

var ballotCandidatesSchema = {
  ballotId: String,
  candidateId: String,
  sortOrder: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
};

var customBallotBallotResponse = {
  customBallotId: String,
  ballotResponseId: String,
  sortOrder: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var localityEarlyVoteSiteSchema = {
  localityId: String,
  earlyVoteSiteId: String,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctEarlyVoteSiteSchema = {
  precinctId: String,
  early_vote_site_id: String,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctElectoralDistrictSchema = {
  precinctId: String,
  electoralDistrictId: String,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctPollingLocationsSchema = {
  precinctId: String,
  pollingLocationId: String,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

//var precinctSplitElectoralDistrictSchema = {
//  precinctSplitId: String,
//  electoralDistrictId: String,
//  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
//}

var precinctSplitPollingLocationsSchema = {
  precinctSplitId: String,
  pollingLocationId: String,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var referendumBallotResponseSchema = {
  referendumId: String,
  ballotResponseId: String,
  sortOrder: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var stateEarlyVoteSiteSchema = {
  stateId: String,
  earlyVoteSiteId: String,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

function addTemporaryCollectionModels(models) {
  models.ballotcandidate = mongoose.model(config.mongoose.model.ballotcandidate, mongoose.Schema(ballotCandidatesSchema));
  models.customballotballotresponse = mongoose.model(config.mongoose.model.customballotballotresponse, mongoose.Schema(customBallotBallotResponse));
  models.localityearlyvotesite = mongoose.model(config.mongoose.model.localityearlyvotesite, mongoose.Schema(localityEarlyVoteSiteSchema));
  models.precinctearlyvotesite = mongoose.model(config.mongoose.model.precinctearlyvotesite, mongoose.Schema(precinctEarlyVoteSiteSchema));
  models.precinctelectoraldistrict = mongoose.model(config.mongoose.model.precinctelectoraldistrict, mongoose.Schema(precinctElectoralDistrictSchema));
  models.precinctpollinglocation = mongoose.model(config.mongoose.model.precinctpollinglocation, mongoose.Schema(precinctPollingLocationsSchema));
  //models.precinctsplitelectoraldistrict = mongoose.model(config.mongoose.model.precinctsplitelectoraldistrict, mongoose.Schema(precinctSplitElectoralDistrictSchema));
  models.precinctsplitpollinglocation = mongoose.model(config.mongoose.model.precinctsplitpollinglocation, mongoose.Schema(precinctSplitPollingLocationsSchema));
  models.referendumballotresponse = mongoose.model(config.mongoose.model.referendumballotresponse, mongoose.Schema(referendumBallotResponseSchema));
  models.stateearlyvotesite = mongoose.model(config.mongoose.model.stateearlyvotesite, mongoose.Schema(stateEarlyVoteSiteSchema));
  return models;
}

module.exports = addTemporaryCollectionModels;