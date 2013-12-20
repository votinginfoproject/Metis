/**
 * Created by bantonides on 12/13/13.
 */
var Types = require('mongoose').Schema.Types;

var models = {};

/*
 * Mongoose Schema Definitions
 */
var ballotSchema = mongoose.Schema({
  id: String, //required
  referendumId: String,
  candidateId: String,
  customBallotId: String,
  writeIn: Boolean,
  imageUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var candidateSchema = mongoose.Schema({
  name: String,
  party: String,
  candidateUrl: String,
  biography: String,
  phone: String,
  photoUrl: String,
  filedMailingAddress: String, //TODO: how to acct for XMLComplexType
  email: String,
  sortOrder: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

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

var electionAdminSchema = mongoose.Schema({
  id: String,     //required
  name: String,
  eoId: String,
  ovcId: String,
  physicalAddress: String,
  mailingAddress: String,
  electionsUrl: String,
  registrationUrl: String,
  amIRegisteredUrl: String,
  absenteeUrl: String,
  whereDoIVoteUrl: String,
  whatIsOnMyBallotUrl: String,
  rulesUrl: String,
  voterServices: String,
  hours: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var electionOfficialSchema = {
  elementId: Number,   //required
  name: String,
  title: String,
  phone: String,
  fax: String,
  email: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var electoralDistrictSchema = mongoose.Schema({
  id: String, //required
  name: String,
  type: String,
  number: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var feedSchema = {
  loadedOn: Date,
  validationStatus: Boolean,
  feedStatus: String,
  name: String,
  feedPath: String
};

var localitySchema = mongoose.Schema({
  id: String,
  name: String,
  stateId: String,
  type: String,
  electionAdminId: String,
  earlyVoteSiteId: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var pollingLocationSchema = mongoose.Schema({
  id: String,   //required
  address: String,
  directions: String,
  pollingHours: String,
  photoUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var precinctSchema = mongoose.Schema({
  id: String,       //required
  name: String,
  number: String,
  localityId: String,
  electoralDistrictId: String,
  ward: String,
  mailOnly: String,
  pollingLocationId: String,
  earlyVoteSiteId: String,
  ballotStyleImageUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var precinctSplitSchema = mongoose.Schema({
  id: String,       //required
  name: String,
  precinctId: String,
  electoralDistrictId: String,
  pollingLocationId: String,
  ballotStyleImageUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
});

var sourceSchema = {
  elementId: Number,
  vipId: Number,  //required
  datetime: Date,
  description: String,
  name: String,
  organizationUrl: String,
  feedContactId: String,
  touUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var streetSegmentSchema = {
  id: String,
  startHouseNumber: String,
  endHouseNumber: String,
  oddEvenBoth: String,
  nonHouseAddress: {
    streetDirection: String,
    streetName: String,
    streetSuffix: String,
    addressDirection: String,
    state: String,
    city: String,
    zip: Number
  },
  precinctId: Number,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

/*
 * End of Schema Definitions
 */
exports.models = models;

exports.initSchemas = function(config, mongoose) {
  models.Ballot = mongoose.model(config.mongoose.model.ballot, mongoose.Schema(ballotSchema));
  models.Candidate = mongoose.model(config.mongoose.model.candidate, mongoose.Schema(candidateSchema));
  models.Contest = mongoose.model(config.mongoose.model.contest, mongoose.Schema(contestSchema));
  models.Election = mongoose.model(config.mongoose.model.election, mongoose.Schema(electionSchema));
  models.ElectionAdmin = mongoose.model(config.mongoose.model.electionAdmin, mongoose.Schema(electionAdminSchema));
  models.ElectionOfficial = mongoose.model(config.mongoose.model.electionOfficial, mongoose.Schema(electionOfficialSchema));
  models.ElectoralDistrictSchema = mongoose.model(config.mongoose.model.electoralDistrict, mongoose.Schema(electoralDistrictSchema));
  models.Feed = mongoose.model(config.mongoose.model.feed, mongoose.Schema(feedSchema));
  models.Locality = mongoose.model(config.mongoose.model.locality, mongoose.Schema(localitySchema));
  models.PollingLocation = mongoose.model(config.mongoose.model.pollingLocation, mongoose.Schema(pollingLocationSchema));
  models.Precinct = mongoose.model(config.mongoose.model.pollingLocation, mongoose.Schema(precinctSchema));
  models.PrecinctSplit = mongoose.model(config.mongoose.model.precinctSplit, mongoose.Schema(precinctSplitSchema));
  models.Source = mongoose.model(config.mongoose.model.source, mongoose.Schema(sourceSchema));
  models.StreetSegment = mongoose.model(config.mongoose.model.streetSegment, mongoose.Schema(streetSegmentSchema));
};


