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

function addTemporaryCollectionModels(models) {
  models.BallotCandidate = mongoose.model(config.mongoose.model.ballotCandidate, mongoose.Schema(ballotCandidatesSchema));

  return models;
}

module.exports = addTemporaryCollectionModels;