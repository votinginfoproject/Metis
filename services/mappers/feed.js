/**
 * Created by bantonides on 12/13/13.
 */
var moment = require('moment');
var _path = require('path');

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
      self: _path.join(path, '/election-administration')
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
    electionMachineType: "Requires 5.0 Schema",
    pollBookType: "Requires 5.0 Schema",
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
      address: addressToShortString(locality._electionAdministration.physicalAddress)
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

var mapPrecinctPollingLocations = function(path, pollingLocations) {
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
      self: _path.join(path, ps.elementId.toString())
    };
  });
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

function mapStreetSegments (path, streetSegments) {
  return streetSegments.map(function (st) {
    return {
      id: st.elementid,
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
exports.mapPrecinctPollingLocations = mapPrecinctPollingLocations;
exports.mapPrecinctPrecinctSplits = mapPrecinctPrecinctSplits;
exports.mapElectionContest = mapElectionContest;
exports.mapPollingSummary = mapPolling;
exports.mapContests = mapContests;
exports.mapResults = mapResults;
exports.mapHistory = mapHistory;
exports.mapStreetSegments = mapStreetSegments;