/**
 * Created by bantonides on 12/13/13.
 */
var Types = require('mongoose').Schema.Types;
var config = require('../config');

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
  referendumIds: [Number],
  candidates: [{
    elementId: Number,
    sortOrder: Number,
    _candidate: { type: Types.ObjectId, ref: config.mongoose.model.candidate }
  }],
  customBallotId: Number,
  writeIn: Boolean,
  imageUrl: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _referenda: [{ type: Types.ObjectId, ref: config.mongoose.model.referendum }],
  _customBallot: { type: Types.ObjectId, ref: config.mongoose.model.customBallot }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotResponseSchema = {
  elementId: Number, //required
  text: String,
  sortOrder: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electoralDistrict: { type: Types.ObjectId, ref: config.mongoose.model.electoralDistrict },
  _ballot: { type: Types.ObjectId, ref: config.mongoose.model.ballot },
  _contestResult: { type: Types.ObjectId, ref: config.mongoose.model.contestResult },
  _ballotLineResults: [{ type: Types.ObjectId, ref: config.mongoose.model.ballotLineResult }]
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _contest: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _locality: { type: Types.ObjectId, ref: config.mongoose.model.locality },
  _precinct: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _precinctSplit: { type: Types.ObjectId, ref: config.mongoose.model.precinctSplit },
  _electoralDistrict: { type: Types.ObjectId, ref: config.mongoose.model.electoralDistrict }
};

var customBallotSchema = {
  elementId: Number, //required
  heading: String,
  ballotResponses: [{
    elementId: Number,
    sortOrder: Number,
    _response: { type: Types.ObjectId, ref: config.mongoose.model.ballotResponse }
  }],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _locality: { type: Types.ObjectId, ref: config.mongoose.model.locality }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electionOfficial: { type: Types.ObjectId, ref: config.mongoose.model.electionOfficial },
  _overseasVoterContact: { type: Types.ObjectId, ref: config.mongoose.model.electionOfficial }
};

var electionOfficialSchema = {
  elementId: Number,   //required
  name: String,
  title: String,
  phone: String,
  fax: String,
  email: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var electoralDistrictSchema = {
  elementId: Number, //required
  name: String,
  type: String,
  number: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _contest: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _precincts: [{ type: Types.ObjectId, ref: config.mongoose.model.precinct }],
  _precinctSplits: [{ type: Types.ObjectId, ref: config.mongoose.model.precinctSplit }]
};

var feedSchema = {
  loadedOn: Date,
  validationStatus: Boolean,
  feedStatus: String,
  name: String,
  feedPath: String,
  _election: { type: Types.ObjectId, ref: config.mongoose.model.election },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state }
};

var localitySchema = {
  elementId: Number,
  name: String,
  stateId: Number,
  type: String,
  electionAdminId: Number,
  earlyVoteSiteIds: [Number],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electionAdministration: { type: Types.ObjectId, ref: config.mongoose.model.electionAdministration },
  _earlyVoteSites: [{ type: Types.ObjectId, ref: config.mongoose.model.earlyVoteSite }],
  _precincts: [{ type: Types.ObjectId, ref: config.mongoose.model.precinct }]
};

var pollingLocationSchema = {
  elementId: Number,   //required
  address: simpleAddressSchema,
  directions: String,
  pollingHours: String,
  photoUrl: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electoralDistricts: [{ type: Types.ObjectId, ref: config.mongoose.model.electoralDistrict }],
  _pollingLocations: [{ type: Types.ObjectId, ref: config.mongoose.model.pollingLocation }],
  _earlyVoteSites: [{ type: Types.ObjectId, ref: config.mongoose.model.earlyVoteSite }],
  _precinctSplits: [{ type: Types.ObjectId, ref: config.mongoose.model.precinctSplit }],
  _streetSegments: [{ type: Types.ObjectId, ref: config.mongoose.model.streetSegment }]
};

var precinctSplitSchema = {
  elementId: Number,       //required
  name: String,
  precinctId: Number,
  electoralDistrictIds: [Number],
  pollingLocationIds: [Number],
  ballotStyleImageUrl: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electoralDistricts: [{ type: Types.ObjectId, ref: config.mongoose.model.electoralDistrict }],
  _pollingLocations: [{ type: Types.ObjectId, ref: config.mongoose.model.pollingLocation }],
  _precinct: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _streetSegments: [{ type: Types.ObjectId, ref: config.mongoose.model.streetSegment }]
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
  ballotResponses: [{
    elementId: Number,
    sortOrder: Number,
    _response: { type: Types.ObjectId, ref: config.mongoose.model.ballotResponse }
  }],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _feedContact: { type: Types.ObjectId, ref: config.mongoose.model.electionOfficial }
};

var stateSchema = {
  elementId: Number, //required
  name: String,
  electionAdministrationId: Number,
  earlyVoteSiteIds: [Number],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electionAdministration: { type: Types.ObjectId, ref: config.mongoose.model.electionAdministration },
  _localities: [{ type: Types.ObjectId, ref: config.mongoose.model.locality }]
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var violationSchema = {
  element_name: String,
  member_name: String,
  description: String,
  objectId: String, //TODO: make DBRef
  feedId: String //TODO: make DBRef
};

/*
 * End of Schema Definitions
 */
exports.models = models;

exports.initSchemas = function (mongoose) {
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
  models.ElectoralDistrict = mongoose.model(config.mongoose.model.electoralDistrict, mongoose.Schema(electoralDistrictSchema));
  models.Feed = mongoose.model(config.mongoose.model.feed, mongoose.Schema(feedSchema));
  models.Locality = mongoose.model(config.mongoose.model.locality, mongoose.Schema(localitySchema));
  models.PollingLocation = mongoose.model(config.mongoose.model.pollingLocation, mongoose.Schema(pollingLocationSchema));
  models.Precinct = mongoose.model(config.mongoose.model.precinct, mongoose.Schema(precinctSchema));
  models.PrecinctSplit = mongoose.model(config.mongoose.model.precinctSplit, mongoose.Schema(precinctSplitSchema));
  models.Referendum = mongoose.model(config.mongoose.model.referendum, mongoose.Schema(referendumSchema));
  models.Source = mongoose.model(config.mongoose.model.source, mongoose.Schema(sourceSchema));
  models.State = mongoose.model(config.mongoose.model.state, mongoose.Schema(stateSchema));
  models.StreetSegment = mongoose.model(config.mongoose.model.streetSegment, mongoose.Schema(streetSegmentSchema));
  models.Violation = mongoose.model(config.mongoose.model.violation, mongoose.Schema(violationSchema));

};


