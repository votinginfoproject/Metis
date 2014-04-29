/**
 * Created by rcartier13 on 1/6/14.
 */

var address = {
  location_name: 'name',
  locationName: 'name',
  line1: 'line1',
  line2: 'line2',
  line3: 'line3',
  city: 'city',
  state: 'state',
  zip: 'zip'
};

var ballotLineResultsData = {
  elementId: '1',
  candidateId: '2',
  ballotResponseId: '3',
  votes: 4,
  certification: 'cert'
};

var electionAdministration = {
  elementId: '2',
  name: 'name',
  physicalAddress: address,
  address: address
};

var referendaData = {
  elementId: '1',
  title: 'title'
};

var ballotResponsesData = {
  _response: {
    elementId: '1',
    text: 'text',
    sortOrder: 2
  }
};

var electionOfficial = {
  elementId: '1',
  name: 'name',
  title: 'title',
  phone: 'phone',
  fax: 'fax',
  email: 'email'
};

var data = {
  feed: {
    id: '1',
    name: 'name',
    feedStatus: 'status',
    fipsCode: 1,
    _election: {
      date: Date('2012-09-06'),
      electionType: 'type'
    },
    _state: {
      name: 'name',
      elementId: '4'
    }
  },

  source: {
    elementId: '1',
    name: 'name',
    datetime: Date('2012-09-06'),
    description: 'desc',
    organizationUrl: 'url',
    touUrl: 'tou',
    _feedContact: {
      name: 'name',
      title: 'title',
      phone: 'phone',
      fax: 'fax',
      email: 'email'
    }
  },

  election: {
    elementId: '1',
    date: Date('2012-09-06'),
    electionType: 'type',
    stateWide: 'yes',
    registrationInfo: 'info',
    absenteeBallotInfo: 'info',
    resultsUrl: 'url',
    pollingHours: 'hours',
    electionDayRegistration: 'reg',
    registrationDeadLine: Date('2012-09-06'),
    absenteeRequestDeadline: Date('2012-09-06'),
    stateId: '2',
    _state: {
      name: 'name',
      localityCount: 3
    }
  },

  state: {
    elementId: 1,
    name: 'name',
    _electionAdministration: electionAdministration
  },

  locality: {
    elementId: '1',
    name: 'name',
    type: 'type',
    _precincts: {
      length: '2'
    },
    _precinctSplits: {
      length: '2'
    },
    _electionAdministration: electionAdministration
  },

  mapFunc: {
    map: function (callback) {
      return callback(electionAdministration);
    },
    data: electionAdministration
  },

  precinct: {
    elementId: '1',
    name: 'name',
    number: 'number',
    ward: 'ward',
    mailOnly: 'mail',
    ballotStyleImageUrl: 'url',
    _streetSegments: {
      length: 'length'
    }
  },

  electoralDistrict: {
    elementId: '1',
    name: 'name',
    type: 'type',
    number: 'number'
  },

  contest: {
    elementId: '1',
    type: 'type',
    office: 'office'
  },

  streetSegments: {
    elementId: '1',
    startHourseNumber: 2,
    endHouseNumber: 3,
    oddEvenBoth: 'yes',
    nonHouseAddress: {
      houseNumber: 4,
      houseNumberPrefix: 'pre',
      houseNumberSuffix: 'suf',
      streetDirection: 'dir',
      streetName: 'street',
      streetSuffix: 'st suf',
      addressDirection: 'dir',
      apartment: 'apt',
      city: 'city',
      state: 'state',
      zip: 'zip'
    }
  },

  earlyVote: {
    elementId: '1',
    name: 'name',
    address: address,
    directions: 'dir',
    voterServices: 'voter',
    startDate: Date('2014-09-05'),
    endDate: Date('2014-10-07'),
    daysTimesOpen: 'times'
  },

  electionAdmin: {
    elementId: '1',
    name: 'name',
    physicalAddress: address,
    mailingAddress: address,
    electionsUrl: 'url',
    registrationUrl: 'url',
    amIRegisteredUrl: 'url',
    absenteeUrl: 'url',
    whereDoIVoteUrl: 'url',
    whatIsOnMyBallotUrl: 'url',
    rulesUrl: 'url',
    voterServices: 'serv',
    _electionOfficial: electionOfficial,
    _overseasVoterContact: electionOfficial,
    hours: 'hours'
  },

  electionContest: {
    elementId: '1',
    type: 'type',
    partisan: 'partisan',
    primaryParty: 'primary',
    electorateSpecifications: 'specs',
    special: 'special',
    office: 'office',
    filingClosedDate: Date('2014-02-02'),
    numberElected: 2,
    numberVotingFor: 3,
    ballotPlacement: 4,
    overview: 'overviewstuff',
    _ballot: {
      elementId: '1',
      candidates: { length: 2 },
      referendumIds: {length: 3}
    },
    _electoralDistrict: {
      elementId: '1',
      name: 'name',
      _precincts: { length: 2 },
      _precinctSplits: { length: 3 }
    },
    _contestResult: {
      elementId: '5',
      totalVotes: 6,
      totalValidVotes: 7,
      overvotes: 8,
      blankVotes: 9,
      certification: 'cert'
    },
    _ballotLineResults: {
      map: function(callback) {
        return callback(ballotLineResultsData);
      },
      data: ballotLineResultsData
    }
  },

  ballot: {
    elementId: '1',
    writeIn: 'yes',
    imageUrl: 'url',
    _referenda: {
      map: function(callback) {
        return callback(referendaData);
      },
      data: referendaData
    },
    _customBallot: {
      elementId: '1',
      heading: 'heading',
      ballotResponses: {
        map: function(callback) {
          return callback(ballotResponsesData);
        },
        data: ballotResponsesData
      }
    }
  },

  candidates: {
    elementId: '1',
    _candidate: {
      name: 'name',
      party: 'party'
    },
    sortOrder: 2
  },

  candidate: {
    elementId: '1',
    name: 'name',
    incumbent: 'incumbent',
    party: 'party',
    candidateUrl: 'url',
    biography: 'bio',
    phone: 'phone',
    photoUrl: 'url',
    filedMailingAddress: address,
    email: 'email',
    sortOrder: 2
  },

  referenda: referendaData,

  referendum: {
    elementId: '1',
    title: 'title',
    subtitle: 'subtitle',
    brief: 'brief',
    text: 'text',
    proStatement: 'pro',
    conStatement: 'con',
    passageThreshold: 'threshold',
    effectOfAbstain: 'abstain',
    ballotResponses: {
      map: function(callback) {
        return callback(ballotResponsesData);
      }
    }
  },

  ballotResponse: ballotResponsesData,

  pollingLocation: {
    elementId: '1',
    address: address,
    directions: 'dir',
    photoUrl: 'url',
    pollingHours: 'hours',
    _precincts: {
      map: function() {}
    },
    _precinctSplits: {
      map: function() {}
    }
  },

  overview: [
    {
      elementType: 'type',
      amount: 1,
      completePct: 2,
      errorCount: 3
    }
  ]
};

module.exports = data;