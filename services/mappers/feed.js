/**
 * Created by bantonides on 12/13/13.
 */
var moment = require('moment');
var _path = require('path');

function addressToShortString (address) {
  return address ? address.city +', ' + address.state + ' ' + address.zip : '';
};

function addressToJson (address) {
  return address ? {
    location_name: address.location_name,
    line1: address.line1,
    line2: address.line2,
    line3: address.line3,
    city: address.city,
    state: address.state,
    zip: address.zip
  } : undefined;
};

var mapFeed = function(path, feed) {
  return {
    id: feed.id,
    date: feed._election ? moment(feed._election.date).utc().format('YYYY-MM-DD') : 'N/A',
    state: feed._state ? feed._state.name : 'State Missing',
    type: feed._election ? feed._election.electionType : 'N/A',
    status: feed.feedStatus,
    name: feed.name,
    self: _path.join(path, feed.id)
  };
};

var mapOverview = function(path, feed) {
  return {
    id: feed.id,
    title: feed.name, //TODO: replace this with a real title for the feed, i.e. 2011-11-03 North Carolina Primary
    error_count: 333, //TODO: replace this with the real error count
    errors: _path.join(path, '/errors'),
    source: _path.join(path, '/source'),
    election: _path.join(path, '/election'),
    state: _path.join(path, '/election/state'),
    localities: _path.join(path, '/election/state/localities'),
    polling_locations: _path.join(path, '/polling'),
    contests: _path.join(path, '/contests'),
    results: _path.join(path, '/results'),
    history: _path.join(path, '/history')
  };
};

var mapSource = function(path, source) {
  return {
    id: source.elementId,
    error_count: 111, //TODO
    errors: _path.join(path, '/errors'),
    source_info: {
      name: source.name,
      date: moment(source.datetime).utc().format('YYYY-MM-DD'),
      description: source.description,
      org_url: source.organizationUrl,
      tou_url: source.touUrl
    },
    feed_contact: {
      name: (source._feedContact) ? source._feedContact.name : null,
      title: (source._feedContact) ? source._feedContact.title : null,
      phone: (source._feedContact) ? source._feedContact.phone : null,
      fax: (source._feedContact) ? source._feedContact.fax : null,
      email: (source._feedContact) ? source._feedContact.email : null
    }
  };
};

var mapElection = function(path, election) {
  return {
    id: election.elementId,
    error_count: 222, //TODO
    errors: _path.join(path, '/errors'),
    date: moment(election.date).utc().format('YYYY-MM-DD'),
    type: election.electionType,
    statewide: election.statewide,
    registration_url: election.registrationInfo,
    absentee_url: election.absenteeBallotInfo,
    results_url: election.resultsUrl,
    polling_hours: election.pollingHours,
    day_of_registration: election.electionDayRegistration,
    registration_deadline: moment(election.registrationDeadline).utc().format('YYYY-MM-DD'),
    absentee_deadline: moment(election.absenteeRequestDeadline).utc().format('YYYY-MM-DD'),
    state: {
      id: election.stateId,
      name: election._state.name,
      locality_count: election._state.localityCount,
      self: _path.join(path, '/state')
    },
    contests: _path.join(path, '/contests')
  };
};

var mapState = function(path, state) {
  return {
    id: state.elementId,
    error_count: 99, //TODO
    name: state.name,
    administration: (state._electionAdministration === undefined) ? null : {
      id: state._electionAdministration.elementId,
      name: state._electionAdministration.name,
      address: addressToShortString(state._electionAdministration.physicalAddress),
      self: _path.join(path, '/electionadministration')
    },
    localities: _path.join(path, '/localities'),
    earlyvotesites: _path.join(path, '/earlyvotesites')
  };
};

var mapLocality = function(path, locality) {
  return {
    id: locality.elementId,
    error_count: -1, //TODO
    name: locality.name,
    type: locality.type,
    election_machine_type: "Requires 5.0 Schema",
    poll_book_type: "Requires 5.0 Schema",
    overview: [ //TODO
      {
        element_type: 'Electoral Districts',
        amount: 0,
        complete_pct: 0,
        error_count: 0
      },
      {
        element_type: 'Precincts',
        amount: 2564,
        complete_pct: 94,
        error_count: 206
      },
      {
        element_type: 'Precinct Splits',
        amount: 2311,
        complete_pct: 12,
        error_count: 322
      },
      {
        element_type: 'Street Segments',
        amount: 234,
        complete_pct: 19,
        error_count: 4223
      }
    ],
    administration: locality._electionAdministration ? {
      id: locality._electionAdministration.elementId,
      name: locality._electionAdministration.name,
      address: addressToShortString(locality._electionAdministration.physicalAddress),
      self: _path.join(path, '/electionadministration')
    } : null,
    earlyvotesites: _path.join(path, '/earlyvotesites'),
    precincts: _path.join(path, '/precincts')
  };
};

var mapEarlyVoteSites = function(path, earlyVoteSites) {
  return earlyVoteSites.map(function (evs) {
    return {
      id: evs.elementId,
      name: evs.name,
      address: addressToShortString(evs.address),
      self: _path.join(path, evs.elementId.toString())
    };
  });
};

var mapLocalityPrecincts = function(path, precincts) {
  return precincts.map(function (precinct) {
    return {
      id: precinct.elementId,
      name: precinct.name,
      precinct_splits: precinct._precinctSplits.length,
      self: _path.join(path, precinct.elementId.toString())
    };
  });
};

var mapLocalities = function(path, localities) {
  return localities.map(function (locality) {
    return {
      id: locality.elementId,
      name: locality.name,
      type: locality.type,
      precincts: locality._precincts.length,
      self: _path.join(path, locality.elementId.toString())
    };
  });
};

var mapPrecinct = function(path, precinct) {
  return {
    id: precinct.elementId,
    error_count: -1, //TODO
    name: precinct.name,
    number: precinct.number,
    ward: precinct.ward,
    mailonly: precinct.mailOnly,
    ballotimage: precinct.ballotStyleImageUrl,
    earlyvotesites: _path.join(path, '/earlyvotesites'),
    electoraldistricts: _path.join(path, '/electoraldistricts'),
    pollinglocations: _path.join(path, '/pollinglocations'),
    precinctsplits: _path.join(path, '/precinctsplits'),
    streetsegments: {
      total: precinct._streetSegments.length,
      error_count: -1, //TODO
      self: _path.join(path, '/streetsegments')
    }
  };
};

function mapElectoralDistricts (path, electoralDistrict) {
  return electoralDistrict.map(function (ed) {
    return {
      id: ed.elementId,
      name: ed.name,
      type: ed.type,
      number: ed.number,
      contests: -1, //TODO: replace this with count from database
      self: _path.join(path, ed.elementId.toString())
    };
  });
};

// === TODO
function mapPrecinctElectoralDistrict(path, electoralDistrict) {
  return {
    id: electoralDistrict.id,
    error_count: -1, //TODO
    name: 'US Pres.',
    type: 'statewide',
    number: 123,
    contests: _path.join(path, '/contests'),
    precincts: _path.join(path, '/precincts'),
    precinctsplits: _path.join(path, '/precinctsplits')
  };
};

function mapPrecinctElectoralDistrictContests(path, electoralDistrict) {
  return [
    {
      id: 123,
      type: 'Type1',
      title: 'Office1',
      self: '/relativeurl'
    },
    {
      id: 124,
      type: 'Type2',
      title: 'Office2',
      self: '/relativeurl'
    }
  ]
};

function mapPrecinctElectoralDistrictPrecincts(path, precincts) {
  return [
    {
      id: 1,
      name: 'P1',
      precinct_splits: 11,
      self: 'relaticepath1'
    },
    {
      id: 2,
      name: 'P2',
      precinct_splits: 22,
      self: 'relaticepath2'
    }
  ]
};

function mapPrecinctElectoralDistrictPrecinctSplits(path, precinctsplits) {
  return [
    {
      id: 22,
      name: 'PS22',
      street_segments: 222,
      self: 'relaticepath22'
    },
    {
      id: 33,
      name: 'PS33',
      street_segments: 333,
      self: 'relaticepath33'
    }
  ]};
// ===
function mapPrecinctSplitElectoralDistrict(path, electoralDistrict) {
  return {
    id: electoralDistrict.id,
    error_count: -1, //TODO
    name: 'Split US Pres.',
    type: 'Split statewide',
    number: 9123,
    contests: _path.join(path, '/contests'),
    precincts: _path.join(path, '/precincts'),
    precinctsplits: _path.join(path, '/precinctsplits')
  };
};

function mapPrecinctSplitElectoralDistrictContests(path, electoralDistrict) {
  return [
    {
      id: 9123,
      type: 'Split Type1',
      title: 'Split Office1',
      self: '/Splitrelativeurl'
    },
    {
      id: 9124,
      type: 'Split Type2',
      title: 'Split Office2',
      self: '/Splitrelativeurl'
    }
  ]
};

function mapPrecinctSplitElectoralDistrictPrecincts(path, precincts) {
  return [
    {
      id: 91,
      name: 'P1',
      precinct_splits: 911,
      self: 'Splitrelaticepath1'
    },
    {
      id: 92,
      name: 'P2',
      precinct_splits: 922,
      self: 'Splitrelaticepath2'
    }
  ]
};

function mapPrecinctSplitElectoralDistrictPrecinctSplits(path, precinctsplits) {
  return [
    {
      id: 922,
      name: 'Split PS22',
      street_segments: 9222,
      self: 'Splitrelaticepath22'
    },
    {
      id: 933,
      name: 'Split PS33',
      street_segments: 9333,
      self: 'Splitrelaticepath33'
    }
  ]};
// ===

var mapPollingLocations = function(path, pollingLocations) {
  return pollingLocations.map(function (pl) {
    return {
      id: pl.elementId,
      name: pl.address ? pl.address.locationName : 'Name Missing',
      address: addressToShortString(pl.address),
      self: _path.join(path, pl.elementId.toString())
    };
  });
};

var mapPrecinctPrecinctSplits = function(path, precinctSplits) {
  return precinctSplits.map(function (ps) {
    return {
      id: ps.elementId,
      name: ps.name,
      street_segments: ps._streetSegments.length,
      self: _path.join(path, ps.elementId.toString())
    };
  });
};

var mapElectionContest = function(path, contest) {
  return {
    id: contest.elementId,
    type: contest.type,
    title: contest.office,
    self: _path.join(path, contest.elementId.toString())
  };
};

function mapContest (path, contest) {
  return {
    id: contest.elementId,
    error_count: -1, //TODO
    type: contest.type,
    partisan: contest.partisan,
    primary_party: contest.primaryParty,
    electorate_specifications: contest.electorateSpecifications,
    special: contest.special,
    office: contest.office,
    filing_closed_date: contest.filingClosedDate ? moment(contest.filingClosedDate).utc().format('YYYY-MM-DD') : null,
    number_elected: contest.numberElected,
    number_voting_for: contest.numberVotingFor,
    ballot_placement: contest.ballotPlacement,
    overview: mapContestOverview(null, null), //TODO: replace with real data
    ballot: contest._ballot ? {
      id: contest._ballot.elementId,
      candidate_count: contest._ballot.candidates ? contest._ballot.candidates.length : 0,
      referendum_count: contest._ballot.referendumIds ? contest._ballot.referendumIds.length : 0,
      self: _path.join(path, '/ballot')
    } : null,
    candidates: _path.join(path, '/candidates'),
    electoral_district: contest._electoralDistrict ? {
      id: contest._electoralDistrict.elementId,
      name: contest._electoralDistrict.name,
      precincts: contest._electoralDistrict._precincts.length,
      precinct_splits: contest._electoralDistrict._precinctSplits.length,
      self: _path.join(path, '/electoraldistrict')
    } : null,
    contest_results: contest._contestResults ? {
      id: contest._contestResults.elementId,
      votes: contest._contestResults.totalVotes,
      valid_votes: contest._contestResults.totalValidVotes,
      overvotes: contest._contestResults.overvotes,
      blank_votes: contest._contestResults.blankVotes,
      certification: contest._contestResults.certification,
      self: _path.join(path, '/contestresults')
    } : null,
    ballot_line_results: contest._ballotLineResults ? contest._ballotLineResults.map(function(blr) {
      return {
        id: blr.elementId,
        candidate_id: blr.candidateId,
        response_id: blr.ballotResponseId,
        votes: blr.votes,
        certification: blr.certification,
        self: _path.join(path, '/ballotlineresults' + blr.elementId.toString())
      };
    }) : null
  };
};

var mapPolling = function(path, data) {
  return [ //TODO: All of these are hardcoded currently
    {
      element_type: 'Localities',
      amount: 100,
      complete_pct: 6,
      error_count: 0
    },
    {
      element_type: 'Electoral Districts',
      amount: 976,
      complete_pct: 21,
      error_count: 888
    },
    {
      element_type: 'Precincts',
      amount: 2756,
      complete_pct: 94,
      error_count: 206
    }
  ];
};

var mapContests = function(path, data) {
  return [ //TODO: All of these are hardcoded currently
    {
      element_type: 'Contests',
      amount: 976,
      complete_pct: 0,
      error_count: 14
    },
    {
      element_type: 'Ballots',
      amount: 976,
      complete_pct: 38,
      error_count: 140
    },
    {
      element_type: 'Candidates',
      amount: 1761,
      complete_pct: 91,
      error_count: 1156
    }
  ];
};



var mapResults = function(path, data) {
  return [ //TODO: All of these are hardcoded currently
    {
      element_type: 'Contest Results',
      amount: 0,
      complete_pct: 0,
      error_count: 0
    },
    {
      element_type: 'Ballot Line Results',
      amount: 10,
      complete_pct: 100,
      error_count: 2
    }
  ];
};

var mapHistory = function(path, data) {
  return [ //TODO: All of these are hardcoded currently
    {
      date: moment(new Date()).format('YYYY-MM-DD'),
      events: [
        {
          time: moment('1:11 PM', 'h:mm A').format('h:mm A'),
          description: 'Processing'
        },
        {
          time: moment('2:13 PM', 'h:mm A').format('h:mm A'),
          description: 'Ready'
        }
      ]
    }
  ];
};

function mapStreetSegments (path, streetSegments) {
  return streetSegments.map(function (st) {
    return {
      id: st.elementId,
      start_house_number: st.startHouseNumber,
      end_house_number: st.endHouseNumber,
      odd_even: st.oddEvenBoth,
      address: st.nonHouseAddress ? {
        house_number: st.nonHouseAddress.houseNumber,
        house_number_prefix: st.nonHouseAddress.houseNumberPrefix,
        house_number_suffix: st.nonHouseAddress.houseNumberSuffix,
        street_direction: st.nonHouseAddress.streetDirection,
        street_name: st.nonHouseAddress.streetName,
        street_suffix: st.nonHouseAddress.streetSuffix,
        address_direction: st.nonHouseAddress.addressDirection,
        apartment: st.nonHouseAddress.apartment,
        city: st.nonHouseAddress.city,
        state: st.nonHouseAddress.state,
        zip: st.nonHouseAddress.zip
      } : null
    };
  });
};

function mapStreetSegmentsErrors (path, streetSegments) {  //TODO: Replace with non-hardcoded data
  return [
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 752,
      title: "Overlapping street segment in precinct",
      details: "Street Segments are overlapping.",
      textualReference:
        "<street-segments><street-segment>1</street-segment><street-segment>2</street-segment></street-segments>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 100,
      title: "Duplicate elements",
      details: "All values for an element are the exact same as another element in all instances except for their id.",
      textualReference: "<elements><element id='x1'>one</element><element id='x2'>one</element></elements>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 15,
      title: "Failed Geocoding",
      details: "Could not Geocode correctly.",
      textualReference: "The GeoCode long1234.32123 could not be parsed.",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Error",
      errorTypeId: 1,
      error_count: 8,
      title: "Missing required element",
      details: "Did not find the id",
      textualReference: "<state>Virginia</state>",
      _feed: 0,
      _source: 0
    }
  ];
};

function mapStreetSegmentsErrors2 (path, streetSegments) { //TODO: Replace with non-hardcoded data
  return [
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 111,
      title: "A warning",
      details: "Street Segments are overlapping.",
      textualReference:
        "<street-segments><street-segment>1</street-segment><street-segment>2</street-segment></street-segments>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Warning",
      errorTypeId: 1,
      error_count: 222,
      title: "Another warning",
      details: "All values for an element are the exact same as another element in all instances except for their id.",
      textualReference: "<elements><element id='x1'>one</element><element id='x2'>one</element></elements>",
      _feed: 0,
      _source: 0
    },
    {
      severityCode: 1,
      severityText: "Error",
      errorTypeId: 1,
      error_count: 444,
      title: "New Error",
      details: "Did not find the id",
      textualReference: "<states><state>MD</state><state>VA</state></states>",
      _feed: 0,
      _source: 0
    }
  ];
};

function mapPrecinctSplit (path, precinctSplit) {
  return {
    id: precinctSplit.elementId,
    error_count: -1, //TODO
    name: precinctSplit.name,
    electoral_districts: _path.join(path, '/electoraldistricts'),
    polling_locations: _path.join(path, '/pollinglocations'),
    street_segments: {
      error_count: -1, //TODO
      total: precinctSplit._streetSegments.length,
      self: _path.join(path, '/streetsegments')
    }
  };
};

function mapEarlyVoteSite (earlyVoteSite) {
  return {
    id: earlyVoteSite.elementId,
    name: earlyVoteSite.name,
    address: addressToJson(earlyVoteSite.address),
    directions: earlyVoteSite.directions,
    voter_services: earlyVoteSite.voterServices,
    start_date: earlyVoteSite.startDate,
    end_date: earlyVoteSite.endDate,
    days_times_open: earlyVoteSite.daysTimesOpen
  };
};

function mapElectionAdministration (electionAdministration) {
  return {
    id: electionAdministration.elementId,
    error_count: -1, // TODO: need field
    name: electionAdministration.name,
    physical_address: addressToJson(electionAdministration.physicalAddress),
    mailing_address: addressToJson(electionAdministration.mailingAddress),
    phone: -1, // TODO: need field
    email: -1, // TODO: need field
    elections_url: electionAdministration.electionsUrl,
    registration_url: electionAdministration.registrationUrl,
    am_i_registered_url: electionAdministration.amIRegisteredUrl,
    absentee_url: electionAdministration.absenteeUrl,
    where_do_i_vote_url: electionAdministration.whereDoIVoteUrl,
    what_is_on_my_ballot_url: electionAdministration.whatIsOnMyBallotUrl,
    rules_url: electionAdministration.rulesUrl,
    voter_services: electionAdministration.voterServices,
    election_official: electionAdministration._electionOfficial ?
      mapElectionOfficial(electionAdministration._electionOfficial) : null,
    overseas_voter_contact: electionAdministration._overseasVoterContact ?
      mapElectionOfficial(electionAdministration._overseasVoterContact) : null,
    hours: electionAdministration.hours
  };
};

function mapElectionOfficial (electionOfficial) {
  return {
    id: electionOfficial.elementId,
    name: electionOfficial.name,
    title: electionOfficial.title,
    phone: electionOfficial.phone,
    fax: electionOfficial.fax,
    email: electionOfficial.email
  };
};

var mapBallot = function(path, ballot) {
  return {
    id: ballot.elementId,
    write_in: ballot.writeIn,
    image_url: ballot.imageUrl,
    candidates: ballot.candidates ? ballot.candidates.map(function(candidate) {
      return {
        id: candidate.elementId,
        name: candidate._candidate.name,
        party: candidate._candidate.party,
        sort_order: candidate.sortOrder,
        self: _path.join(path, '/candidates/' + candidate.elementId.toString())
      };
    }) : [],
    referenda: ballot._referenda ? ballot._referenda.map(function(referendum) {
      return {
        id: referendum.elementId,
        title: referendum.title,
        self: _path.join(path, '/referenda/' + referendum.elementId.toString())
      };
    }) : [],
    custom_ballot: ballot._customBallot ? {
      id: ballot._customBallot.elementId,
      heading: ballot._customBallot.heading,
      ballot_responses: ballot._customBallot.ballotResponses.map(function(response) {
        return {
          id: response._response.elementId,
          text: response._response.text,
          sort_order: response._response.sortOrder
        };
      })
    } : null
  };
};

var mapContestCandidates = function(path, candidates) {
  return [
    {id: 31000655, name: 'Barack Obama', party: 'DEM'},
    {id: 31000656, name: 'Mitt Romney', party: 'REP'},
    {id: 31000657, name: 'Gary Johnson', party: 'LIB'}
  ];
};

var mapContestOverview = function(path, data) { //TODO
  return [
    {
      element_type: 'Ballots',
      amount: 976,
      complete_pct: 38,
      error_count: 140
    },
    {
      element_type: 'Candidates',
      amount: 1761,
      complete_pct: 91,
      error_count: 1156
    },
    {
      element_type: 'Referendums',
      amount: 123,
      complete_pct: 52,
      error_count: 640
    },
    {
      element_type: 'Custom Ballots',
      amount: 99,
      complete_pct: 100,
      error_count: 0
    },
    {
      element_type: 'Ballot Responses',
      amount: 1003,
      complete_pct: 10,
      error_count: 460
    }
  ];
};

var mapCandidate = function (path, candidate) {
  return {
    id: candidate.elementId,
    name: '*',
    incumbent: '*',
    party: '*',
    biography: '*',
    phone: '*',
    photo_url: '*',
    address: '*',
    email: '*',
    sort_order: '*'
  };
};

var mapContestContestResults = function(path, contestResults) {
  return [
    { id: 302030103, votes: 2000, valid_votes: 1500, overvotes: 300, blank_votes: 200 },
    { id: 302030104, votes: 150, valid_votes: 100, overvotes: 0, blank_votes: 15 }
  ];
};

var mapContestBallotLineResults  = function (path, ballotLineResults) {
  return [
    { id: 400014, votes: 400, victorious: 'Yes' },
    { id: 400015, votes: 100, victorious: 'No' }
  ];
};


exports.mapFeed = mapFeed;
exports.mapFeedOverview = mapOverview;
exports.mapSource = mapSource;
exports.mapElection = mapElection;
exports.mapState = mapState;
exports.mapLocality = mapLocality;
exports.mapEarlyVoteSites = mapEarlyVoteSites;
exports.mapLocalityPrecincts = mapLocalityPrecincts;
exports.mapLocalities = mapLocalities;
exports.mapPrecinct = mapPrecinct;
exports.mapElectoralDistricts = mapElectoralDistricts;
exports.mapPrecinctElectoralDistrict = mapPrecinctElectoralDistrict;
exports.mapPrecinctElectoralDistrictContests = mapPrecinctElectoralDistrictContests;
exports.mapPrecinctElectoralDistrictPrecincts = mapPrecinctElectoralDistrictPrecincts;
exports.mapPrecinctElectoralDistrictPrecinctSplits = mapPrecinctElectoralDistrictPrecinctSplits;
exports.mapPollingLocations = mapPollingLocations;
exports.mapPrecinctPrecinctSplits = mapPrecinctPrecinctSplits;
exports.mapPrecinctSplitElectoralDistrict = mapPrecinctSplitElectoralDistrict;
exports.mapPrecinctSplitElectoralDistrictContests = mapPrecinctSplitElectoralDistrictContests;
exports.mapPrecinctSplitElectoralDistrictPrecincts = mapPrecinctSplitElectoralDistrictPrecincts;
exports.mapPrecinctSplitElectoralDistrictPrecinctSplits = mapPrecinctSplitElectoralDistrictPrecinctSplits;
exports.mapElectionContest = mapElectionContest;
exports.mapPollingSummary = mapPolling;
exports.mapContests = mapContests;
exports.mapResults = mapResults;
exports.mapHistory = mapHistory;
exports.mapStreetSegments = mapStreetSegments;
exports.mapStreetSegmentsErrors = mapStreetSegmentsErrors;
exports.mapStreetSegmentsErrors2 = mapStreetSegmentsErrors2;
exports.mapPrecinctSplit = mapPrecinctSplit;
exports.mapEarlyVoteSite = mapEarlyVoteSite;
exports.mapElectionAdministration = mapElectionAdministration;
exports.mapContest = mapContest;
exports.mapBallot = mapBallot;
exports.mapContestCandidates = mapContestCandidates;
exports.mapContestOverview = mapContestOverview;
exports.mapCandidate = mapCandidate;
exports.mapContestContestResults = mapContestContestResults;
exports.mapContestBallotLineResults = mapContestBallotLineResults;
