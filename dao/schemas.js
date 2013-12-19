/**
 * Created by bantonides on 12/13/13.
 */
var Types = require('mongoose').Schema.Types;

var models = {};

/*
 * Mongoose Schema Definitions
 */
var feedSchema = {
  loadedOn: Date,
  validationStatus: Boolean,
  feedStatus: String,
  name: String,
  feedPath: String
};

var sourceSchema = {
  elementId: Number,
  vipId: Number,  //required
  datetime: Date,
  description: String,
  name: String,
  organizationUrl: String,
  feedContactId: String, //TODO: investigate possibly replacing with feed_contact_id
  touUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var electionSchema = {
  elementId: Number,  //required
  date: Date,
  electionType: String,
  stateId: String,
  statewide: Boolean,
  registrationInfo: String,
  absenteeBallotInfo: String,
  resultsUrl: String,
  pollingHours: String,
  electionDayRegistration: Boolean,
  registrationDeadline: Date,
  absenteeRequestDeadline: Date,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var electionOfficialSchema = {
  elementId: Number,   //required
  name: String,
  title: String,
  phone: String,
  fax: String,
  email: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var contestSchema = {
  elementId: Number,     //required
  electionId:  String,
  electoralDistrictId:  String,
  type: String,
  partisan: Boolean,
  primaryParty: String,
  electorateSpecifications: String,
  special: Boolean,
  office: String,
  filingClosedDate: Date,
  numberElected:  String,
  numberVotingFor: String,
  ballotId: String,
  ballotPlacement: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

/*
 * End of Schema Definitions
 */
exports.models = models;

exports.initSchemas = function(config, mongoose) {
  models.Feed = mongoose.model(config.mongoose.model.feed, mongoose.Schema(feedSchema));
  models.Source = mongoose.model(config.mongoose.model.source, mongoose.Schema(sourceSchema));
  models.Election = mongoose.model(config.mongoose.model.election, mongoose.Schema(electionSchema));
  models.ElectionOfficial = mongoose.model(config.mongoose.model.electionOfficial, mongoose.Schema(electionOfficialSchema));
  models.Contest = mongoose.model(config.mongoose.model.contest, mongoose.Schema(contestSchema));
};



