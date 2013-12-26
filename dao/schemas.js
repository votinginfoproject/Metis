/**
 * Created by bantonides on 12/13/13.
 */
var Types = require('mongoose').Schema.Types;

var models = {};

var simpleAddressSchema = {
  locationName: String,
  line1: String,
  line2: String,
  line3: String,
  city: String,
  state: String,
  zip: String
};

/*
 * Mongoose Schema Definitions
 */
var ballotSchema = {
  elementId: Number, //required
  referendumId: Number,
  candidates: [{
    id: Number,
    sortOrder: Number
  }],
  customBallotId: Number,
  writeIn: Boolean,
  imageUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var ballotLineResultSchema = {
  elementId: Number, //required
  contestId: Number,
  jurisdictionId: Number,
  entireDistrict: Boolean,
  candidateId: Number,
  ballotResponseId: Number,
  votes: Number,
  victorious: Boolean,
  certification: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var ballotResponseSchema = {
  elementId: Number, //required
  text: String,
  sortOrder: Number,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var candidateSchema = {
  elementId: Number, //required
  name: String,
  party: String,
  candidateUrl: String,
  biography: String,
  phone: String,
  photoUrl: String,
  filedMailingAddress: simpleAddressSchema,
  email: String,
  sortOrder: Number,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var contestSchema = {
  elementId: Number,     //required
  electionId:  Number,
  electoralDistrictId:  Number,
  type: String,
  partisan: Boolean,
  primaryParty: String,
  electorateSpecifications: String,
  special: Boolean,
  office: String,
  filingClosedDate: Date,
  numberElected:  Number,
  numberVotingFor: Number,
  ballotId: Number,
  ballotPlacement: Number,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var contestResultSchema = {
  elementId: Number, //required
  contestId: Number,
  jurisdictionId: Number,
  entireDistrict: Boolean,
  totalVotes: Number,
  totalValidVotes: Number,
  overvotes: Number,
  blankVotes: Number,
  acceptedProvisionalVotes: Number,
  rejectedVotes: Number,
  certification: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var customBallotSchema = {
  elementId: Number, //required
  heading: String,
  ballotResponse: [{
    id: Number,
    sortOrder: Number
  }],
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var earlyVoteSiteSchema = {
  elementId: Number, //required
  name: String,
  address: simpleAddressSchema,
  directions: String,
  voterServices: String,
  startDate: Date,
  endDate: Date,
  daysTimesOpen: String,
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

var electionAdminSchema = {
  elementId: Number,     //required
  name: String,
  eoId: Number,
  ovcId: Number,
  physicalAddress: simpleAddressSchema,
  mailingAddress: simpleAddressSchema,
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

var electoralDistrictSchema = {
  elementId: Number, //required
  name: String,
  type: String,
  number: Number,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var feedSchema = {
  loadedOn: Date,
  validationStatus: Boolean,
  feedStatus: String,
  name: String,
  feedPath: String
};

var localitySchema = {
  elementId: Number,
  name: String,
  stateId: Number,
  type: String,
  electionAdminId: Number,
  earlyVoteSiteIds: [Number],
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var pollingLocationSchema = {
  elementId: Number,   //required
  address: simpleAddressSchema,
  directions: String,
  pollingHours: String,
  photoUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var precinctSchema = {
  elementId: Number,       //required
  name: String,
  number: String,
  localityId: Number,
  electoralDistrictIds: [Number],
  ward: String,
  mailOnly: Boolean,
  pollingLocationIds: [Number],
  earlyVoteSiteIds: [Number],
  ballotStyleImageUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var precinctSplitSchema = {
  elementId: Number,       //required
  name: String,
  precinctId: Number,
  electoralDistrictIds: [Number],
  pollingLocationIds: [Number],
  ballotStyleImageUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var referendumSchema = {
  elementId: Number, //required
  title: String,
  subtitle: String,
  brief: String,
  text: String,
  proStatement: String,
  conStatement: String,
  passageThreshold: String,
  effectOfAbstain: String,
  ballotResponse: {
    id: Number,
    sortOrder: Number
  },
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var sourceSchema = {
  elementId: Number,
  vipId: Number,  //required
  datetime: Date,
  description: String,
  name: String,
  organizationUrl: String,
  feedContactId: Number,
  touUrl: String,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var stateSchema = {
  elementId: Number, //required
  name: String,
  electionAdminstrationId: Number,
  earlyVoteSiteIds: [Number],
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

var streetSegmentSchema = {
  elementId: Number, //required
  startHouseNumber: Number,
  endHouseNumber: Number,
  oddEvenBoth: String,
  startApartmentNumber: Number,
  endApartmentNumber: Number,
  nonHouseAddress: {
    houseNumber: Number,
    houseNumberPrefix: String,
    houseNumberSuffix: String,
    streetDirection: String,
    streetName: String,
    streetSuffix: String,
    addressDirection: String,
    apartment: String,
    city: String,
    state: String,
    zip: String
  },
  precinctId: Number,
  precinctSplitId: Number,
  _feed: { type: Types.ObjectId, ref: 'Feed'}
};

/*
 * End of Schema Definitions
 */
exports.models = models;

exports.initSchemas = function(config, mongoose) {
  models.Ballot = mongoose.model(config.mongoose.model.ballot, mongoose.Schema(ballotSchema));
  models.BallotResponse = mongoose.model(config.mongoose.model.ballotResponse, mongoose.Schema(ballotResponseSchema));
  models.BallotLineResult = mongoose.model(config.mongoose.model.ballotLineResult, mongoose.Schema(ballotLineResultSchema));
  models.Candidate = mongoose.model(config.mongoose.model.candidate, mongoose.Schema(candidateSchema));
  models.Contest = mongoose.model(config.mongoose.model.contest, mongoose.Schema(contestSchema));
  models.ContestResult = mongoose.model(config.mongoose.model.contestResult, mongoose.Schema(contestResultSchema));
  models.CustomBallot = mongoose.model(config.mongoose.model.customBallot, mongoose.Schema(customBallotSchema));
  models.EarlyVoteSite = mongoose.model(config.mongoose.model.earlyVoteSite, mongoose.Schema(earlyVoteSiteSchema));
  models.Election = mongoose.model(config.mongoose.model.election, mongoose.Schema(electionSchema));
  models.ElectionAdmin = mongoose.model(config.mongoose.model.electionAdministration, mongoose.Schema(electionAdminSchema));
  models.ElectionOfficial = mongoose.model(config.mongoose.model.electionOfficial, mongoose.Schema(electionOfficialSchema));
  models.ElectoralDistrictSchema = mongoose.model(config.mongoose.model.electoralDistrict, mongoose.Schema(electoralDistrictSchema));
  models.Feed = mongoose.model(config.mongoose.model.feed, mongoose.Schema(feedSchema));
  models.Locality = mongoose.model(config.mongoose.model.locality, mongoose.Schema(localitySchema));
  models.PollingLocation = mongoose.model(config.mongoose.model.pollingLocation, mongoose.Schema(pollingLocationSchema));
  models.Precinct = mongoose.model(config.mongoose.model.precinct, mongoose.Schema(precinctSchema));
  models.PrecinctSplit = mongoose.model(config.mongoose.model.precinctSplit, mongoose.Schema(precinctSplitSchema));
  models.Referendum = mongoose.model(config.mongoose.model.referendum, mongoose.Schema(referendumSchema));
  models.Source = mongoose.model(config.mongoose.model.source, mongoose.Schema(sourceSchema));
  models.State = mongoose.model(config.mongoose.model.state, mongoose.Schema(stateSchema));
  models.StreetSegment = mongoose.model(config.mongoose.model.streetSegment, mongoose.Schema(streetSegmentSchema));
};


