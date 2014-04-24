/**
 * Created by bantonides on 3/6/14.
 */
const
  mongoose = require('mongoose'),
  config = require('../config');

var ballotCandidatesSchema = {
  ballotId: Number,
  candidateId: Number,
  sortOrder: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
};

var customBallotBallotResponse = {
  customBallotId: Number,
  ballotResponseId: Number,
  sortOrder: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var localityEarlyVoteSiteSchema = {
  localityId: Number,
  earlyVoteSiteId: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctEarlyVoteSiteSchema = {
  precinctId: Number,
  early_vote_site_id: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctElectoralDistrictSchema = {
  precinctId: Number,
  electoralDistrictId: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctPollingLocationsSchema = {
  precinctId: Number,
  pollingLocationId: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctSplitElectoralDistrictSchema = {
  precinctSplitId: Number,
  electoralDistrictId: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var precinctSplitPollingLocationsSchema = {
  precinctSplitId: Number,
  pollingLocationId: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var referendumBallotResponseSchema = {
  referendumId: Number,
  ballotResponseId: Number,
  sortOrder: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

var stateEarlyVoteSiteSchema = {
  stateId: Number,
  earlyVoteSiteId: Number,
  _feed: { type: mongoose.Schema.Types.ObjectId, ref: config.mongoose.model.feed }
}

function addTemporaryCollectionModels(models) {
  models.BallotCandidate = mongoose.model(config.mongoose.model.ballotCandidate, mongoose.Schema(ballotCandidatesSchema));
  models.CustomBallotBallotResponse = mongoose.model(config.mongoose.model.customBallotBallotResponse, mongoose.Schema(customBallotBallotResponse));
  models.LocalityEarlyVoteSite = mongoose.model(config.mongoose.model.localityEarlyVoteSite, mongoose.Schema(localityEarlyVoteSiteSchema));
  models.PrecinctEarlyVoteSite = mongoose.model(config.mongoose.model.precinctEarlyVoteSite, mongoose.Schema(precinctEarlyVoteSiteSchema));
  models.PrecinctElectoralDistrict = mongoose.model(config.mongoose.model.precinctElectoralDistrict, mongoose.Schema(precinctElectoralDistrictSchema));
  models.PrecinctPollingLocation = mongoose.model(config.mongoose.model.precinctPollingLocation, mongoose.Schema(precinctPollingLocationsSchema));
  //models.PrecinctSplitElectoralDistrict = mongoose.model(config.mongoose.model.precinctSplitElectoralDistrict, mongoose.Schema(precinctSplitElectoralDistrictSchema));
  models.PrecinctSplitPollingLocation = mongoose.model(config.mongoose.model.precinctSplitPollingLocation, mongoose.Schema(precinctSplitPollingLocationsSchema));
  models.ReferendumBallotResponse = mongoose.model(config.mongoose.model.referendumBallotResponse, mongoose.Schema(referendumBallotResponseSchema));
  models.StateEarlyVoteSite = mongoose.model(config.mongoose.model.stateEarlyVoteSite, mongoose.Schema(stateEarlyVoteSiteSchema));
  return models;
}

module.exports = addTemporaryCollectionModels;