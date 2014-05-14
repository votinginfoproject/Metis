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
  zip: String,
  gisXY: String
};

/*
 * Mongoose Schema Definitions
 */
var ballotSchema = {
  elementId: String, //required
  referendumIds: [{
    elementId: String,
    sortOrder: Number
  }],
  candidates: [{
    elementId: String,
    sortOrder: Number,
    _candidate: { type: Types.ObjectId, ref: config.mongoose.model.candidate }
  }],
  contestIds: [{
    elementId: String,
    sortOrder: Number
  }],
  customBallotId: {
    elementId: String,
    sortOrder: Number
  },
  writeIn: Boolean,
  imageUrl: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _referenda: [{ type: Types.ObjectId, ref: config.mongoose.model.referendum }],
  _customBallot: { type: Types.ObjectId, ref: config.mongoose.model.customballot },
  _contests: [{ type: Types.ObjectId, ref: config.mongoose.model.contest }]
};


var ballotRequiredFields =  {
  v3: [],
  v5: []
};

var ballotErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballot },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotLineResultSchema = {
  elementId: String, //required
  contestId: String,
  referendumId: String,
  jurisdictionId: String,
  entireDistrict: Boolean,
  candidateId: String,
  ballotResponseId: String,
  votes: Number,
  victorious: Boolean,
  certification: String,
  voteType: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _contest: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _candidate: { type: Types.ObjectId, ref: config.mongoose.model.candidate },
  _ballotResponse: { type: Types.ObjectId, ref: config.mongoose.model.ballotresponse },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _locality: { type: Types.ObjectId, ref: config.mongoose.model.locality },
  _precinct: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _precinctSplit: { type: Types.ObjectId, ref: config.mongoose.model.precinctsplit },
  _electoralDistrict: { type: Types.ObjectId, ref: config.mongoose.model.electoraldistrict }
};

var ballotLineResultRequiredFields = {
  v3: [
    'contestId',
    'jurisdictionId',
    'entireDistrict',
    'votes'
  ],
  v5: [
    'contestId',
    'jurisdictionId',
    'entireDistrict',
    'votes',
    'referendumId',
    'voteType'
  ]
};

var ballotLineResultErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballotlineresult },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotResponseSchema = {
  elementId: String, //required
  text: String,
  sortOrder: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotResponseRequiredFields = {
  v3: [
    'text'
  ],
  v5: [
    'text'
  ]
};

var ballotResponseErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballotresponse },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var candidateSchema = {
  elementId: String, //required
  name: String,
  party: String, // v3.0 Only
  candidateUrl: String,
  biography: String,
  phone: String,
  photoUrl: String,
  filedMailingAddress: simpleAddressSchema,
  email: String,
  sortOrder: Number,
  incumbent: Boolean,
  lastName: String,
  partyId: String,
  candidateStatus: String,
  ballotId: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _party: { type: Types.ObjectId, ref: config.mongoose.model.party }
};

var candidateRequiredFields = {
  v3: [
    'name'
  ],
  v5: [
    'name',
    'lastName'
  ]
};

var candidateErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.candidate },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var contestSchema = {
  elementId: String,     //required
  electionId:  String,
  electoralDistrictId:  String,
  type: String,
  partisan: Boolean,
  primaryParty: String, // v3.0 Only
  primaryPartyId: String,
  electorateSpecifications: String,
  special: Boolean,
  office: String,
  filingClosedDate: Date,
  numberElected:  Number,
  numberVotingFor: Number,
  ballotId: String,
  ballotPlacement: Number,
  writeIn: Boolean,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electoralDistrict: { type: Types.ObjectId, ref: config.mongoose.model.electoraldistrict },
  _ballot: { type: Types.ObjectId, ref: config.mongoose.model.ballot },
  _contestResult: { type: Types.ObjectId, ref: config.mongoose.model.contestresult },
  _ballotLineResults: [{ type: Types.ObjectId, ref: config.mongoose.model.ballotlineresult }],
  _party: { type: Types.ObjectId, ref: config.mongoose.model.party }
};


var contestRequiredFields = {
  v3: [
    'electionId',
    'electoralDistrictId',
    'type'
  ],
  v5: [
    'electionId',
    'electoralDistrictId'
  ]
};

var contestErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var contestResultSchema = {
  elementId: String, //required
  contestId: String,
  referendumId: String,
  jurisdictionId: String,
  entireDistrict: Boolean,
  totalVotes: Number,
  totalValidVotes: Number,
  overvotes: Number,
  blankVotes: Number,
  acceptedProvisionalVotes: Number,
  rejectedVotes: Number,
  certification: String,
  voteType: Boolean,
  machineId: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _contest: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _locality: { type: Types.ObjectId, ref: config.mongoose.model.locality },
  _precinct: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _precinctSplit: { type: Types.ObjectId, ref: config.mongoose.model.precinctsplit },
  _electoralDistrict: { type: Types.ObjectId, ref: config.mongoose.model.electoraldistrict }
};

var contestResultRequiredFields = {
  v3: [
    'contest_id',
    'jurisdiction_id',
    'entireDistrict'
  ],
  v5: [
    'contestId',
    'jurisdictionId',
    'entireDistrict',
    'referendumId',
    'voteType'
  ]
};

var contestResultErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.contestresult },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var customBallotSchema = {
  elementId: String, //required
  heading: String,
  ballotResponses: [{
    elementId: String,
    sortOrder: Number,
    _response: { type: Types.ObjectId, ref: config.mongoose.model.ballotresponse }
  }],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var customBallotRequiredFields = {
  v3: [
    'heading',
    'ballotResponses'
  ],
  v5: [
    'heading',
    'ballotResponses'
  ]
};

var customBallotErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.customballot },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var earlyVoteSiteSchema = {
  elementId: String, //required
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

var earlyVoteSiteRequiredFields = {
  v3: [
    'address.line1',
    'address.city',
    'address.state',
    'address.zip'
  ],
  v5: [
    'address.line1',
    'address.city',
    'address.state',
    'address.zip'
  ]
};

var earlyVoteSiteErrorSchema = {
  severityCode: String,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.earlyvotesite },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var electionSchema = {
  elementId: String,  //required
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
  name: String,
  divisionId: [String],
  uocavaMailDeadline: Date,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state }
};

var electionRequiredFields = {
  v3: [
    'date',
    'stateId'
  ],
  v5: [
    'date',
    'stateId'
  ]
};

var electionErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.election },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var electionAdminSchema = {
  elementId: String,     //required
  name: String,
  eoId: String,
  ovcId: String,
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
  phone: String,
  email: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electionOfficial: { type: Types.ObjectId, ref: config.mongoose.model.electionofficial },
  _overseasVoterContact: { type: Types.ObjectId, ref: config.mongoose.model.electionofficial }
};

var electionAdminRequiredFields = {
  v3: [],
  v5: []
};

var electionAdminErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.electionadministration },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var electionOfficialSchema = {
  elementId: String,   //required
  name: String,
  title: String,
  phone: String,
  fax: String,
  email: String,
  electionAdminId: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var electionOfficalRequiredFields = {
  v3: [
    'name'
  ],
  v5: [
    'name'
  ]
};

var electionOfficialErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.electionofficial },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var electoralDistrictSchema = {
  elementId: String, //required
  name: String,
  type: String,
  number: Number,
  description: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _contest: { type: Types.ObjectId, ref: config.mongoose.model.contest },
  _precincts: [{ type: Types.ObjectId, ref: config.mongoose.model.precinct }],
  _precinctSplits: [{ type: Types.ObjectId, ref: config.mongoose.model.precinctsplit }]
};

var electoralDistrictRequiredFields = {
  v3: [
    'name'
  ],
  v5: [
    'name'
  ]
};

var electoralDistrictErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.electoraldistrict },
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
  fipsCode: Number,
  friendlyId: String,
  feedPath: String,
  specVersion: Number,
  _election: { type: Types.ObjectId, ref: config.mongoose.model.election },
  _state: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _feedContact: { type: Types.ObjectId, ref: config.mongoose.model.electionofficial }
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
  elementId: String, //required
  name: String,
  stateId: String,
  type: String,
  electionAdminId: String,
  earlyVoteSiteIds: [String],
  parentIds: [String],
  pollbookTypes: [String],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electionAdministration: { type: Types.ObjectId, ref: config.mongoose.model.electionadministration },
  _earlyVoteSites: [{ type: Types.ObjectId, ref: config.mongoose.model.earlyvotesite }],
  _precincts: [{ type: Types.ObjectId, ref: config.mongoose.model.precinct }]
};

var localityRequiredFields = {
  v3: [
    'name',
    'stateId',
    'type'
  ],
  v5: [
    'name',
    'stateId',
    'type',
    'parentIds'
  ]
};

var localityErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.locality },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var pollingLocationSchema = {
  elementId: String, //required
  address: simpleAddressSchema,
  directions: String,
  pollingHours: String,
  photoUrl: String,
  name: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _precincts: [{ type: Types.ObjectId, ref: config.mongoose.model.precinct }],
  _precinctSplits: [{ type: Types.ObjectId, ref: config.mongoose.model.precinctsplit }]
};

var pollingLocationRequiredFields = {
  v3: [
    'address.zip',
    'address.city'
  ],
  v5: [
    'address.zip',
    'address.city'
  ]
};

var pollingLocationErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.pollinglocation },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var precinctSchema = {
  elementId: String,       //required
  name: String,
  number: String,
  localityId: String,
  electoralDistrictIds: [String],
  ward: String,
  mailOnly: Boolean,
  pollingLocationIds: [String],
  earlyVoteSiteIds: [String],
  ballotStyleImageUrl: String,
  registeredVoters: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electoralDistricts: [{ type: Types.ObjectId, ref: config.mongoose.model.electoraldistrict }],
  _pollingLocations: [{ type: Types.ObjectId, ref: config.mongoose.model.pollinglocation }],
  _earlyVoteSites: [{ type: Types.ObjectId, ref: config.mongoose.model.earlyvotesite }],
  _precinctSplits: [{ type: Types.ObjectId, ref: config.mongoose.model.precinctsplit }],
  _streetSegments: [{ type: Types.ObjectId, ref: config.mongoose.model.streetsegment }],
  _geometries: [{ type: Types.ObjectId, ref: config.mongoose.model.multigeometry }]
};

var precinctRequiredFields = {
  v3: [
    'name',
    'localityId'
  ],
  v5: [
    'name',
    'localityId'
  ]
};

var precinctErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var precinctSplitSchema = {
  elementId: String,       //required
  name: String,
  precinctId: String,
  electoralDistrictIds: [String],
  pollingLocationIds: [String],
  ballotStyleImageUrl: String,
  registeredVoters: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electoralDistricts: [{ type: Types.ObjectId, ref: config.mongoose.model.electoraldistrict }],
  _pollingLocations: [{ type: Types.ObjectId, ref: config.mongoose.model.pollinglocation }],
  _precinct: { type: Types.ObjectId, ref: config.mongoose.model.precinct },
  _streetSegments: [{ type: Types.ObjectId, ref: config.mongoose.model.streetsegment }],
  _geometries: [{ type: Types.ObjectId, ref: config.mongoose.model.multigeometry }]
};

var precinctSplitRequiredFields = {
  v3: [
    'name',
    'precinctId'
  ],
  v5: [
    'name',
    'precinctId'
  ]
};

var precinctSplitErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.precinctsplit },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var referendumSchema = {
  elementId: String, //required
  title: String,
  subtitle: String,
  brief: String,
  text: String,
  proStatement: String,
  conStatement: String,
  passageThreshold: String,
  effectOfAbstain: String,
  electoralDistrictId: String,
  ballotPlacement: Number,
  ballotResponses: [{
    elementId: String,
    sortOrder: Number,
    _response: { type: Types.ObjectId, ref: config.mongoose.model.ballotresponse }
  }],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var referendumRequiredFields = {
  v3: [
    'title',
    'text',
    'ballotResponses'
  ],
  v5: [
    'title',
    'text',
    'ballotResponses',
    'electoralDistrictId'
  ]
};

var referendumErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.referendum },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var sourceSchema = {
  elementId: String,
  vipId: Number,  //required
  datetime: Date,
  description: String,
  name: String,
  organizationUrl: String,
  feedContactId: Number,
  touUrl: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _feedContact: { type: Types.ObjectId, ref: config.mongoose.model.electionofficial }
};

var sourceRequiredFields = {
  v3: [
    'name',
    'vipId',
    'datetime'
  ],
  v5: [
    'name',
    'vipId',
    'datetime'
  ]
};

var sourceErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.source },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var stateSchema = {
  elementId: String, //required
  name: String,
  electionAdministrationId: String,
  earlyVoteSiteIds: [String],
  abbreviation: String,
  region: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed },
  _electionAdministration: { type: Types.ObjectId, ref: config.mongoose.model.electionadministration },
  _localities: [{ type: Types.ObjectId, ref: config.mongoose.model.locality }]
};

var stateRequiredFields = {
  v3: [
    'name'
  ],
  v5: [
    'name',
    'abbreviation'
  ]
};

var stateErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.state },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var streetSegmentSchema = {
  elementId: String, //required
  startHouseNumber: Number,
  endHouseNumber: Number,
  oddEvenBoth: String,
  startApartmentNumber: Number,
  endApartmentNumber: Number,
  city: String,
  zip: String,
  stateId: String,
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
  precinctId: String,
  precinctSplitId: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var streetSegmentRequiredFields = {
  v3: [
    'startHouseNumber',
    'endHouseNumber',
    'oddEvenBoth',
    'nonHouseAddress.streetName',
    'nonHouseAddress.city',
    'nonHouseAddress.state',
    'nonHouseAddress.zip',
    'precinctId'
  ],
  v5: [
    'startHouseNumber',
    'endHouseNumber',
    'oddEvenBoth',
    'nonHouseAddress.streetName',
    'nonHouseAddress.city',
    'nonHouseAddress.state',
    'nonHouseAddress.zip',
    'precinctId'
  ]
};

var streetSegmentErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.streetsegment },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotStyleSchema = {
  elementId: String,
  name: String,
  electionId: String,
  referendumId: String,
  sortOrder: String,
  contestIds: [{
    ballotId: [String],
    contestOrder: String,
    contestId: String,
    candidateIds: [{
      sortOrder: Number,
      candidateId: String
    }]
  }],
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var ballotStyleRequiredFields = {
  v3: [],
  v5: [
    'electionId'
  ]
};

var ballotStyleErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.ballotstyle },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var partySchema = {
  elementId: String,
  name: String,
  majorParty: Boolean,
  abbreviation: String,
  initial: String,
  sortOrder: Number,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var partyRequiredFields = {
  v3: [],
  v5: [
    'name'
  ]
};

var partyErrorSchema = {
  severityCode: Number,
  severityText: String,
  errorCode: Number,
  title: String,
  details: String,
  textualReference: String,
  refElementId: String,
  _ref: { type: Types.ObjectId, ref: config.mongoose.model.party },
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var precinctSplitBallotStyleSchema = {
  precinctId: String,
  precinctSplitId: String,
  ballotStyleId: String,
  _feed: { type: Types.ObjectId, ref: config.mongoose.model.feed }
};

var overviewSchema = {
  elementType: String,
  amount: Number,
  completePct: Number,
  errorCount: Number,
  section: String,
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
};

var uniqueIdSchema = {
  elementId: String,
  model: String,
  ref: String
};

/*
 * End of Schema Definitions
 */
exports.types = mongoose.Types;
exports.models = models;

exports.initSchemas = function (mongoose) {
  models.ballots = mongoose.model(config.mongoose.model.ballot, mongoose.Schema(ballotSchema));
  models.ballotresponses = mongoose.model(config.mongoose.model.ballotresponse, mongoose.Schema(ballotResponseSchema));
  models.ballotlineresults = mongoose.model(config.mongoose.model.ballotlineresult, mongoose.Schema(ballotLineResultSchema));
  models.candidates = mongoose.model(config.mongoose.model.candidate, mongoose.Schema(candidateSchema));
  models.contests = mongoose.model(config.mongoose.model.contest, mongoose.Schema(contestSchema));
  models.contestresults = mongoose.model(config.mongoose.model.contestresult, mongoose.Schema(contestResultSchema));
  models.customballots = mongoose.model(config.mongoose.model.customballot, mongoose.Schema(customBallotSchema));
  models.earlyvotesites = mongoose.model(config.mongoose.model.earlyvotesite, mongoose.Schema(earlyVoteSiteSchema));
  models.elections = mongoose.model(config.mongoose.model.election, mongoose.Schema(electionSchema));
  models.electionadmins = mongoose.model(config.mongoose.model.electionadministration, mongoose.Schema(electionAdminSchema));
  models.electionofficials = mongoose.model(config.mongoose.model.electionofficial, mongoose.Schema(electionOfficialSchema));
  models.electoraldistricts = mongoose.model(config.mongoose.model.electoraldistrict, mongoose.Schema(electoralDistrictSchema));
  models.feeds = mongoose.model(config.mongoose.model.feed, mongoose.Schema(feedSchema));
  models.localitys = mongoose.model(config.mongoose.model.locality, mongoose.Schema(localitySchema));
  models.pollinglocations = mongoose.model(config.mongoose.model.pollinglocation, mongoose.Schema(pollingLocationSchema));
  models.precincts = mongoose.model(config.mongoose.model.precinct, mongoose.Schema(precinctSchema));
  models.precinctsplits = mongoose.model(config.mongoose.model.precinctsplit, mongoose.Schema(precinctSplitSchema));
  models.referendums = mongoose.model(config.mongoose.model.referendum, mongoose.Schema(referendumSchema));
  models.sources = mongoose.model(config.mongoose.model.source, mongoose.Schema(sourceSchema));
  models.states = mongoose.model(config.mongoose.model.state, mongoose.Schema(stateSchema));
  models.streetsegments = mongoose.model(config.mongoose.model.streetsegment, mongoose.Schema(streetSegmentSchema));

  models.ballotstyles = mongoose.model(config.mongoose.model.ballotstyle, mongoose.Schema(ballotStyleSchema));
  models.parties = mongoose.model(config.mongoose.model.party, mongoose.Schema(partySchema));
  models.precinctsplitballotstyle = mongoose.model(config.mongoose.model.precinctsplitballotstyle, mongoose.Schema(precinctSplitBallotStyleSchema));

  models.ballots.Error = mongoose.model(config.mongoose.model.balloterror, mongoose.Schema(ballotErrorSchema));
  models.ballotresponses.Error = mongoose.model(config.mongoose.model.ballotresponseerror, mongoose.Schema(ballotResponseErrorSchema));
  models.ballotlineresults.Error = mongoose.model(config.mongoose.model.ballotlineresulterror, mongoose.Schema(ballotLineResultErrorSchema));
  models.candidates.Error = mongoose.model(config.mongoose.model.candidateerror, mongoose.Schema(candidateErrorSchema));
  models.contests.Error = mongoose.model(config.mongoose.model.contesterror, mongoose.Schema(contestErrorSchema));
  models.contestresults.Error = mongoose.model(config.mongoose.model.contestresulterror, mongoose.Schema(contestResultErrorSchema));
  models.customballots.Error = mongoose.model(config.mongoose.model.customballoterror, mongoose.Schema(customBallotErrorSchema));
  models.earlyvotesites.Error = mongoose.model(config.mongoose.model.earlyvotesiteerror, mongoose.Schema(earlyVoteSiteErrorSchema));
  models.elections.Error = mongoose.model(config.mongoose.model.electionerror, mongoose.Schema(electionErrorSchema));
  models.electionadmins.Error = mongoose.model(config.mongoose.model.electionadministrationerror, mongoose.Schema(electionAdminErrorSchema));
  models.electionofficials.Error = mongoose.model(config.mongoose.model.electionofficialerror, mongoose.Schema(electionOfficialErrorSchema));
  models.electoraldistricts.Error = mongoose.model(config.mongoose.model.electoraldistricterror, mongoose.Schema(electoralDistrictErrorSchema));
  models.feeds.Error = mongoose.model(config.mongoose.model.feederror, mongoose.Schema(feedErrorSchema));
  models.localitys.Error = mongoose.model(config.mongoose.model.localityerror, mongoose.Schema(localityErrorSchema));
  models.pollinglocations.Error = mongoose.model(config.mongoose.model.pollinglocationerror, mongoose.Schema(pollingLocationErrorSchema));
  models.precincts.Error = mongoose.model(config.mongoose.model.precincterror, mongoose.Schema(precinctErrorSchema));
  models.precinctsplits.Error = mongoose.model(config.mongoose.model.precinctspliterror, mongoose.Schema(precinctSplitErrorSchema));
  models.referendums.Error = mongoose.model(config.mongoose.model.referendumerror, mongoose.Schema(referendumErrorSchema));
  models.sources.Error = mongoose.model(config.mongoose.model.sourceerror, mongoose.Schema(sourceErrorSchema));
  models.states.Error = mongoose.model(config.mongoose.model.stateerror, mongoose.Schema(stateErrorSchema));
  models.streetsegments.Error = mongoose.model(config.mongoose.model.streetsegmenterror, mongoose.Schema(streetSegmentErrorSchema));

  models.ballotstyles.Error = mongoose.model(config.mongoose.model.ballotstyleerror, mongoose.Schema(ballotStyleErrorSchema));
  models.parties.Error = mongoose.model(config.mongoose.model.partyerror, mongoose.Schema(partyErrorSchema));

  models.overview = mongoose.model(config.mongoose.model.overview, mongoose.Schema(overviewSchema));

  models.uniqueid = mongoose.model(config.mongoose.model.uniqueid, mongoose.Schema(uniqueIdSchema));
  models.county = mongoose.model(config.mongoose.model.county, mongoose.Schema(countySchema));
  models.fips = mongoose.model(config.mongoose.model.fips, mongoose.Schema(fipsSchema));

  // Set up indexes
  /*
  models.ballots.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.ballotresponses.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.ballotlineresults.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.candidates.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.contests.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.contestresults.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.customballots.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.earlyvotesites.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.elections.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.electionadmins.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.electionofficials.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.electoraldistricts.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.localitys.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.pollinglocations.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.precincts.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.precinctsplits.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.referendums.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.sources.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.states.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.streetsegments.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.ballotstyles.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.parties.schema.index({elementId: 1, _feed: 1}, {unique: true});
  models.precinctsplitelectoraldistrict.schema.index({_feed: 1}, {unique: true});
  models.precinctsplitballotstyle.schema.index({_feed: 1}, {unique: true});
  models.overview.schema.index({_feed: 1}, {unique: true});
  models.uniqueid.schema.index({elementType:1}, {unique: true});
  */
  models.ballots.schema.index({_feed: 1});
  models.ballotresponses.schema.index({_feed: 1});
  models.ballotlineresults.schema.index({_feed: 1});
  models.candidates.schema.index({_feed: 1});
  models.contests.schema.index({_feed: 1});
  models.contestresults.schema.index({_feed: 1});
  models.customballots.schema.index({_feed: 1});
  models.earlyvotesites.schema.index({_feed: 1});
  models.elections.schema.index({_feed: 1});
  models.electionadmins.schema.index({_feed: 1});
  models.electionofficials.schema.index({_feed: 1});
  models.electoraldistricts.schema.index({_feed: 1});
  models.localitys.schema.index({_feed: 1});
  models.pollinglocations.schema.index({_feed: 1});
  models.precincts.schema.index({_feed: 1});
  models.precinctsplits.schema.index({_feed: 1});
  models.referendums.schema.index({_feed: 1});
  models.sources.schema.index({_feed: 1});
  models.states.schema.index({_feed: 1});
  models.streetsegments.schema.index({_feed: 1});
  models.ballotstyles.schema.index({_feed: 1});
  models.parties.schema.index({_feed: 1});
  models.precinctsplitelectoraldistrict.schema.index({_feed: 1});
  models.precinctsplitballotstyle.schema.index({_feed: 1});
  models.overview.schema.index({_feed: 1});


  // Set up required fields
  models.ballots.RequiredFields = ballotRequiredFields;
  models.ballotlineresults.RequiredFields = ballotLineResultRequiredFields;
  models.ballotresponses.RequiredFields = ballotResponseRequiredFields;
  models.candidates.RequiredFields = candidateRequiredFields;
  models.contests.RequiredFields = contestRequiredFields;
  models.contestresults.RequiredFields = contestResultRequiredFields;
  models.customballots.RequiredFields = customBallotRequiredFields;
  models.earlyvotesites.RequiredFields = earlyVoteSiteRequiredFields;
  models.elections.RequiredFields = electionRequiredFields;
  models.electionadmins.RequiredFields = electionAdminRequiredFields;
  models.electionofficials.RequiredFields = electionOfficalRequiredFields;
  models.electoraldistricts.RequiredFields = electoralDistrictRequiredFields;
  models.localitys.RequiredFields = localityRequiredFields;
  models.pollinglocations.RequiredFields = pollingLocationRequiredFields;
  models.precincts.RequiredFields = precinctRequiredFields;
  models.precinctsplits.RequiredFields = precinctSplitRequiredFields;
  models.referendums.RequiredFields = referendumRequiredFields;
  models.sources.RequiredFields = sourceRequiredFields;
  models.states.RequiredFields = stateRequiredFields;
  models.streetsegments.RequiredFields = streetSegmentRequiredFields;
  models.ballotstyles.RequiredFields = ballotStyleRequiredFields;
  models.parties.RequiredFields = partyRequiredFields;

  // Set up field counts
  models.ballots.fieldCount = utils.countProperties(ballotSchema);
  models.ballotlineresults.fieldCount = utils.countProperties(ballotLineResultSchema);
  models.ballotresponses.fieldCount = utils.countProperties(ballotResponseSchema);
  models.contests.fieldCount = utils.countProperties(contestSchema);
  models.contestresults.fieldCount = utils.countProperties(contestResultSchema);
  models.candidates.fieldCount = utils.countProperties(candidateSchema);
  models.earlyvotesites.fieldCount = utils.countProperties(earlyVoteSiteSchema);
  models.electionadmins.fieldCount = utils.countProperties(electionAdminSchema);
  models.electionofficials.fieldCount = utils.countProperties(electionOfficialSchema);
  models.electoraldistricts.fieldCount = utils.countProperties(electoralDistrictSchema);
  models.localitys.fieldCount = utils.countProperties(localitySchema);
  models.pollinglocations.fieldCount = utils.countProperties(pollingLocationSchema);
  models.precincts.fieldCount = utils.countProperties(precinctSchema);
  models.precinctsplits.fieldCount = utils.countProperties(precinctSplitSchema);
  models.referendums.fieldCount = utils.countProperties(referendumSchema);
  models.streetsegments.fieldCount = utils.countProperties(streetSegmentSchema);
};


