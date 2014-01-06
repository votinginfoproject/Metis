/**
 * Created by rcartier13 on 1/6/14.
 */


var simpleAddress = {
  locationName: 'Place',
    line1: 'blah',
    line2: '',
    line3: '',
    city: 'Reston',
    state: 'VA',
    zip: '20202'
};

var mockedModels = {
  ballots : {
    elementId: 1,
    referendumId: 2,
    candidates: [{id: 3, sortOrder: 0}, {id:4, sortOrder: 1}],
    customBallotID: 5,
    writeIn: false,
    imageUrl: 'FakeUrl.edu'
  },

  ballotResponse : {
    elementId: 1,
    test: 'test',
    sortOrder: 2
  },

  ballotLineResult : {
    elementId: 1, //required
    contestId: 2,
    jurisdictionId: 3,
    entireDistrict: true,
    candidateId: 4,
    ballotResponseId: 5,
    votes: 6,
    victorious: false,
    certification: 'cert'
  },

  candidate : {
    elementId: 1, //required
    name: 'name',
    party: 'Tea',
    candidateUrl: 'www.awesome.com',
    biography: 'is a person',
    phone: '555-555-5555',
    photoUrl: 'www.imgur.com',
    filedMailingAddress: simpleAddress,
    email: 'booyah@yahoo',
    sortOrder: 2
  },

  contest : {
    elementId: 1,     //required
    electionId:  2,
    electoralDistrictId:  3,
    type: "type",
    partisan: false,
    primaryParty: "party",
    electorateSpecifications: "electorate",
    special: true,
    office: "office",
    filingClosedDate: "2013-05-05",
    numberElected:  4,
    numberVotingFor: 5,
    ballotId: 6,
    ballotPlacement: 7
  },

  contestResult : {
    elementId: 1, //required
    contestId: 2,
    jurisdictionId: 3,
    entireDistrict: false,
    totalVotes: 4,
    totalValidVotes: 5,
    overvotes: 6,
    blankVotes: 7,
    acceptedProvisionalVotes: 8,
    rejectedVotes: 9,
    certification: "cert"
  },

  customBallot : {
    elementId: 1, //required
    heading: "heading",
    ballotResponse: [{
      id: 2,
      sortOrder: 3
    }]
  },

  earlyVoteSite : {
    elementId: 1, //required
    name: "name",
    address: simpleAddress,
    directions: "direction",
    voterServices: "services",
    startDate: "2013-07-05",
    endDate: "2013-06-03",
    daysTimesOpen: "everyday"
  },

  election : {
    elementId: 1,  //required
    date: "2012-06-03",
    electionType: "election",
    stateId: "state",
    statewide: true,
    registrationInfo: "info",
    absenteeBallotInfo: "absent",
    resultsUrl: "url.com",
    pollingHours: "hours",
    electionDayRegistration: false,
    registrationDeadline: "2013-07-03",
    absenteeRequestDeadline: "2013-03-03"
  },

  electionAdmin : {
    elementId: 1,     //required
    name: "name",
    eoId: 2,
    ovcId: 3,
    physicalAddress: simpleAddress,
    mailingAddress: simpleAddress,
    electionsUrl: "election",
    registrationUrl: "url.com",
    amIRegisteredUrl: "amI.com",
    absenteeUrl: "absentee.com",
    whereDoIVoteUrl: "whereDo.com",
    whatIsOnMyBallotUrl: "whatIs.com",
    rulesUrl: "rules.com",
    voterServices: "services.com",
    hours: "12-6pm"
  },

  electionOfficial : {
    elementId: 1,   //required
    name: "name",
    title: "title",
    phone: "phone",
    fax: "fax",
    email: "email@someplace.com",
  },

  electoralDistrict : {
    elementId: 1, //required
    name: "name",
    type: "type",
    number: "number"
  },

  feed : {
    loadedOn: "2013-03-03",
    validationStatus: false,
    feedStatus: "status",
    name: "name",
    feedPath: "path"
  },

  locality : {
    elementId: 1,
    name: "name",
    stateId: 2,
    type: "type",
    electionAdminId: 3,
    earlyVoteSiteIds: [4]
  },

  pollingLocation : {
    elementId: 1,   //required
    address: simpleAddress,
    directions: "directions",
    pollingHours: "hours",
    photoUrl: "photo.com"
  },

  precinct : {
    elementId: 1,       //required
    name: "name",
    number: "number",
    localityId: 2,
    electoralDistrictIds: [3],
    ward: "ward",
    mailOnly: true,
    pollingLocationIds: [4],
    earlyVoteSiteIds: [5],
    ballotStyleImageUrl: "ballot.com"
  },

  precinctSplit : {
    elementId: 1,       //required
    name: "name",
    precinctId: 2,
    electoralDistrictIds: [3],
    pollingLocationIds: [4],
    ballotStyleImageUrl: "ballot.com"
  },

  referendum : {
    elementId: 1, //required
    title: "title",
    subtitle: "subtitle",
    brief: "brief",
    text: "text",
    proStatement: "pro",
    conStatement: "con",
    passageThreshold: "passage",
    effectOfAbstain: "effect",
    ballotResponse: [{
      id: 2,
      sortOrder: 3
    }]
  },

  source : {
    elementId: 1,
    vipId: 2,  //required
    datetime: "2013-03-03",
    description: "description",
    name: "name",
    organizationUrl: "org.com",
    feedContactId: 3,
    touUrl: "tou.com"
  },

  state : {
    elementId: 1, //required
    name: "name",
    electionAdministrationId: 2,
    earlyVoteSiteIds: [3]
  },

  streetSegment : {
    elementId: 1, //required
    startHouseNumber: 2,
    endHouseNumber: 3,
    oddEvenBoth: "odd",
    startApartmentNumber: 4,
    endApartmentNumber: 5,
    nonHouseAddress: {
      houseNumber: 6,
      houseNumberPrefix: "prefix",
      houseNumberSuffix: "suffix",
      streetDirection: "st direction",
      streetName: "st name",
      streetSuffix: "st suffix",
      addressDirection: "addr Dir",
      apartment: "apt",
      city: "city",
      state: "state",
      zip: "12234"
    },
    precinctId: 7,
    precinctSplitId: 8
  }
};

module.exports = mockedModels;