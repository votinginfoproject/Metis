/**
 * Created by bantonides on 12/13/13.
 */
var mongoose = require('mongoose');
var Types = mongoose.Schema.Types;
var config = require('../config');

var utils = require('../feed-processor/overview/utils');

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

var ballotErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballot },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _contest: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _candidate: { type: Types.ObjectId, ref: config.mongoose.model.candidate },
  _ballotResponse: { type: Types.ObjectId, ref: config.mongoose.model.ballotResponse },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _locality: { type: Types.ObjectId, ref: config.mongoose.model.locality },
  _precinct: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _precinctSplit: { type: Types.ObjectId, ref: config.mongoose.model.precinctSplit },
  _electoralDistrict: { type: Types.ObjectId, ref: config.mongoose.model.electoralDistrict }
};

var ballotLineResultErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballotLineResult },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotResponseSchema = {
  elementId: Number, //required
  text: String,
  sortOrder: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotResponseErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballotResponse },
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

var candidateErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.candidate },
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

var contestErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var contestResultErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.contestResult },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var customBallotErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.customBallot },
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

var earlyVoteSiteErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.earlyVoteSite },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var electionErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.election },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var electionAdminErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.electionAdministration },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var electionOfficialErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.electionOfficial },
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

var electoralDistrictErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.electoralDistrict },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var feedSchema = {
  complete: Boolean,
  failed: Boolean,
  loadedOn: Date,
  completedOn: Date,
  validationStatus: Boolean,
  feedStatus: String,
  name: String,
  feedPath: String,
  _election: { type: Types.ObjectId, ref: config.mongoose.model.election },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _feedContact: { type: Types.ObjectId, ref: config.mongoose.model.electionOfficial }
};

var feedErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var localitySchema = {
  elementId: Number, //required
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

var localityErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.locality },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var pollingLocationSchema = {
  elementId: Number, //required
  address: simpleAddressSchema,
  directions: String,
  pollingHours: String,
  photoUrl: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _precincts: [{ type: Types.ObjectId, ref: config.mongoose.model.precinct }],
  _precinctSplits: [{ type: Types.ObjectId, ref: config.mongoose.model.precinctSplit }]
};

var pollingLocationErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.pollingLocation },
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

var precinctErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var precinctSplitErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.precinctSplit },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var referendumErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.referendum },
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

var sourceErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.source },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var stateErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
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

var streetSegmentErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: Number,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.streetSegment },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var overviewSchema = {
  elementType: String,
  amount: Number,
  completePct: Number,
  errorCount: Number,
  section: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var countySchema = {
  stateFIPS: Number,
  countyFIPS: Number,
  name: String,
  fullName: String,
  polygon: String,
  multipolygon: String
};

var fipsSchema = {
  stateFIPS: Number,
  name: String,
  stateAbbr: String
}

/*
 * End of Schema Definitions
 */
exports.types = mongoose.Types;
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

  models.Ballot.Error = mongoose.model(config.mongoose.model.ballotError, mongoose.Schema(ballotErrorSchema));
  models.BallotResponse.Error = mongoose.model(config.mongoose.model.ballotResponseError, mongoose.Schema(ballotResponseErrorSchema));
  models.BallotLineResult.Error = mongoose.model(config.mongoose.model.ballotLineResultError, mongoose.Schema(ballotLineResultErrorSchema));
  models.Candidate.Error = mongoose.model(config.mongoose.model.candidateError, mongoose.Schema(candidateErrorSchema));
  models.Contest.Error = mongoose.model(config.mongoose.model.contestError, mongoose.Schema(contestErrorSchema));
  models.ContestResult.Error = mongoose.model(config.mongoose.model.contestResultError, mongoose.Schema(contestResultErrorSchema));
  models.CustomBallot.Error = mongoose.model(config.mongoose.model.customBallotError, mongoose.Schema(customBallotErrorSchema));
  models.EarlyVoteSite.Error = mongoose.model(config.mongoose.model.earlyVoteSiteError, mongoose.Schema(earlyVoteSiteErrorSchema));
  models.Election.Error = mongoose.model(config.mongoose.model.electionError, mongoose.Schema(electionErrorSchema));
  models.ElectionAdmin.Error = mongoose.model(config.mongoose.model.electionAdministrationError, mongoose.Schema(electionAdminErrorSchema));
  models.ElectionOfficial.Error = mongoose.model(config.mongoose.model.electionOfficialError, mongoose.Schema(electionOfficialErrorSchema));
  models.ElectoralDistrict.Error = mongoose.model(config.mongoose.model.electoralDistrictError, mongoose.Schema(electoralDistrictErrorSchema));
  models.Feed.Error = mongoose.model(config.mongoose.model.feedError, mongoose.Schema(feedErrorSchema));
  models.Locality.Error = mongoose.model(config.mongoose.model.localityError, mongoose.Schema(localityErrorSchema));
  models.PollingLocation.Error = mongoose.model(config.mongoose.model.pollingLocationError, mongoose.Schema(pollingLocationErrorSchema));
  models.Precinct.Error = mongoose.model(config.mongoose.model.precinctError, mongoose.Schema(precinctErrorSchema));
  models.PrecinctSplit.Error = mongoose.model(config.mongoose.model.precinctSplitError, mongoose.Schema(precinctSplitErrorSchema));
  models.Referendum.Error = mongoose.model(config.mongoose.model.referendumError, mongoose.Schema(referendumErrorSchema));
  models.Source.Error = mongoose.model(config.mongoose.model.sourceError, mongoose.Schema(sourceErrorSchema));
  models.State.Error = mongoose.model(config.mongoose.model.stateError, mongoose.Schema(stateErrorSchema));
  models.StreetSegment.Error = mongoose.model(config.mongoose.model.streetSegmentError, mongoose.Schema(streetSegmentErrorSchema));

  models.Overview = mongoose.model(config.mongoose.model.overview, mongoose.Schema(overviewSchema));


  models.County = mongoose.model(config.mongoose.model.county, mongoose.Schema(countySchema));
  models.Fips = mongoose.model(config.mongoose.model.fips, mongoose.Schema(fipsSchema));


  models.Ballot.fieldCount = utils.countProperties(ballotSchema);
  models.BallotLineResult.fieldCount = utils.countProperties(ballotLineResultSchema);
  models.BallotResponse.fieldCount = utils.countProperties(ballotResponseSchema);
  models.Contest.fieldCount = utils.countProperties(contestSchema);
  models.ContestResult.fieldCount = utils.countProperties(contestResultSchema);
  models.Candidate.fieldCount = utils.countProperties(candidateSchema);
  models.EarlyVoteSite.fieldCount = utils.countProperties(earlyVoteSiteSchema);
  models.ElectionAdmin.fieldCount = utils.countProperties(electionAdminSchema);
  models.ElectionOfficial.fieldCount = utils.countProperties(electionOfficialSchema);
  models.ElectoralDistrict.fieldCount = utils.countProperties(electoralDistrictSchema);
  models.Locality.fieldCount = utils.countProperties(localitySchema);
  models.PollingLocation.fieldCount = utils.countProperties(pollingLocationSchema);
  models.Precinct.fieldCount = utils.countProperties(precinctSchema);
  models.PrecinctSplit.fieldCount = utils.countProperties(precinctSplitSchema);
  models.Referendum.fieldCount = utils.countProperties(referendumSchema);
  models.StreetSegment.fieldCount = utils.countProperties(streetSegmentSchema);
};


