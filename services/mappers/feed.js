/**
 * Created by bantonides on 12/13/13.
 */
var moment = require('moment');
var _path = require('path');
var _ = require('underscore');

function addressToShortString(address) {
  return address ? address.city +', ' + address.state + ' ' + address.zip : '';
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
    error_count: 111,
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
    error_count: 222,
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
    error_count: 99,
    name: state.name,
    administration: (state._electionAdministration === undefined) ? null : {
      id: state._electionAdministration.elementId,
      name: state._electionAdministration.name,
      address: addressToShortString(state._electionAdministration.physicalAddress),
      self: _path.join(path, '/election-administration')
    },
    localities: _path.join(path, '/localities'),
    earlyvotesites: _path.join(path, '/earlyvotesites')
  };
};

var mapStateEarlyVoteSites = function(path, earlyVoteSites) {
  return _.map(earlyVoteSites, function (evs) {
    return {
      id: evs.elementId,
      name: evs.name,
      address: addressToShortString(evs.address),
      self: _path.join(path, evs.elementId.toString())
    };
  });
};

var mapLocality = function(path, locality) {
  return {
    id: locality.elementId,
    error_count: -1,
    name: locality.name,
    type: locality.type,
    electionMachineType: "Requires 5.0 Schema",
    pollBookType: "Requires 5.0 Schema",
    overview: [
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
      address: addressToShortString(locality._electionAdministration.physicalAddress)
    } : null,
    earlyvotesites: _path.join(path, '/earlyvotesites'),
    precincts: _path.join(path, '/precincts')
  };
};

var mapLocalityEarlyVoteSites = function(path, earlyVoteSites) {
  return _.map(earlyVoteSites, function (evs) {
    return {
      id: evs.elementId,
      name: evs.name,
      address: addressToShortString(evs.address),
      self: _path.join(path, evs.elementId.toString())
    };
  });
};

var mapLocalityPrecincts = function(path, precincts) {
  return _.map(precincts, function (precinct) {
    return {
      id: precinct.elementId,
      name: precinct.name,
      precinct_splits: -1,
      self: _path.join(path, precinct.elementId.toString())
    };
  });
};

var mapLocalities = function(path, localities) {
  return _.map(localities, function (locality) {
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
    id: precinct.id,
    error_count: 33,
    name: "Precinct Name",
    number: 44,
    ward: "Precinct Ward",
    mailonly: "Yes",
    ballotimage: "http://www...",
    earlyvotesites: _path.join(path, '/earlyvotesites'),
    electoraldistricts: _path.join(path, '/electoraldistricts'),
    pollinglocations: _path.join(path, '/pollinglocations'),
    precinctsplits: _path.join(path, '/precinctsplits'),
    streetsegments: 300
  };
};

var mapPrecinctEarlyVoteSites = function(path, locality) {
  return [
    {
      id: 6640017,
      name: "Court Services",
      address: "Graham, NC 27253"
    },
    {
      id: 6640018,
      name: "Mebane Arts Center",
      address: "Mebane, NC 27302"
    },
    {
      id: 6640019,
      name: "May Memorial Library",
      address: "Burlington, NC 11111"
    },
    {
      id: 66400,
      name: "Name",
      address: "Address"
    }
  ]
};

var mapPrecinctElectoralDistricts = function(path, locality) {
  return [
    {
      id: 7001,
      name: "District Name",
      type: "Statewide",
      contests: 2
    },
    {
      id: 7002,
      name: "District 2",
      type: "Other Type",
      contests: 5
    },
    {
      id: 7003,
      name: "District 3",
      type: "Some other Type",
      contests: 12
    }
  ]
};

var mapPrecinctPollingLocations = function(path, locality) {
  return [
    {
      id: 111,
      name: "Court Services",
      address: "Graham, NC 27253"
    },
    {
      id: 222,
      name: "Mebane Arts Center",
      address: "Mebane, NC 27302"
    },
    {
      id: 333,
      name: "May Memorial Library",
      address: "Burlington, NC 11111"
    },
    {
      id: 444,
      name: "Name",
      address: "Address"
    }
  ]
};

var mapPrecinctPrecinctSplits = function(path, locality) {
  return [
    {
      id: 1,
      name: "Split1",
      streetsegments: 0
    },
    {
      id: 2,
      name: "Split2",
      streetsegments: 1
    },
    {
      id: 3,
      name: "Split3",
      streetsegments: 3
    },
    {
      id: 4,
      name: "Split4",
      streetsegments: 12
    }
  ]
};

var mapElectionContest = function(path, contest) {
  return {
      id: contest.elementId,
      type: contest.type,
      title: contest.office
    };
};

var mapPolling = function(path, data) {
  return [
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
  return [
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
  return [
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
  return [
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

exports.mapFeed = mapFeed;
exports.mapFeedOverview = mapOverview;
exports.mapSource = mapSource;
exports.mapElection = mapElection;
exports.mapState = mapState;
exports.mapStateEarlyVoteSites = mapStateEarlyVoteSites;
exports.mapLocality = mapLocality;
exports.mapLocalityEarlyVoteSites = mapLocalityEarlyVoteSites;
exports.mapLocalityPrecincts = mapLocalityPrecincts;
exports.mapLocalities = mapLocalities;
exports.mapPrecinct = mapPrecinct;
exports.mapPrecinctEarlyVoteSites = mapPrecinctEarlyVoteSites;
exports.mapPrecinctElectoralDistricts = mapPrecinctElectoralDistricts;
exports.mapPrecinctPollingLocations = mapPrecinctPollingLocations;
exports.mapPrecinctPrecinctSplits = mapPrecinctPrecinctSplits;
exports.mapElectionContest = mapElectionContest;
exports.mapPollingSummary = mapPolling;
exports.mapContests = mapContests;
exports.mapResults = mapResults;
exports.mapHistory = mapHistory;