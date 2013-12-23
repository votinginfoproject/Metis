/**
 * Created by bantonides on 12/13/13.
 */
var moment = require('moment');
var _path = require('path');

var mapFeed = function(path, feed) {
  return {
    id: feed.id,
    date: moment(feed.loadedOn).format('YYYY-MM-DD'),
    state: 'Unknown',
    type: 'Unknown',
    status: feed.feedStatus,
    name: feed.name,
    edit: _path.join(path, feed.id)
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
    polling_locations: _path.join(path, '/polling'),
    contests: _path.join(path, '/contests'),
    results: _path.join(path, '/results'),
    history: _path.join(path, '/history')
  };
};

var mapSource = function(path, source, electionOfficial) {
  return {
    id: source.elementId,
    error_count: 111,
    errors: _path.join(path, '/errors'),
    source_info: {
      name: source.name,
      date: moment(source.datetime).format('YYYY-MM-DD'),
      description: source.description,
      org_url: source.organizationUrl,
      tou_url: source.touUrl
    },
    feed_contact: {
      name: (electionOfficial) ? electionOfficial.name : null,
      title: (electionOfficial) ? electionOfficial.title : null,
      phone: (electionOfficial) ? electionOfficial.phone : null,
      fax: (electionOfficial) ? electionOfficial.fax : null,
      email: (electionOfficial) ? electionOfficial.email : null
    }
  };
};

var mapElection = function(path, election) {
  return {
    id: election.elementId,
    error_count: 222,
    errors: _path.join(path, '/errors'),
    date: moment(election.date).format('YYYY-MM-DD'),
    type: election.electionType,
    statewide: election.statewide,
    registration_url: election.registrationInfo,
    absentee_url: election.absenteeBallotInfo,
    results_url: election.resultsUrl,
    polling_hours: election.pollingHours,
    day_of_registration: election.electionDayRegistration,
    registration_deadline: moment(election.registrationDeadline).format('YYYY-MM-DD'),
    absentee_deadline: moment(election.absenteeRequestDeadline).format('YYYY-MM-DD'),
    state: {
      id: election.stateId,
      name: 'Unknown',
      locality_count: 100
    },
    contests: _path.join(path, '/contests')
  };
};

var mapElectionState = function(path, election) {
  return {
    id: 10,
    name: "South Carolina",
    localities: [
      {
        id: 1,
        name: "Alamance",
        precints: 37
      },
      {
        id: 2,
        name: "Anson",
        precints: 7
      },
      {
        id: 3,
        name: "Burke",
        precints: 21
      },
      {
        id: 4,
        name: "Zandell",
        precints: 4
      }
    ]
  };
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
exports.mapElectionState = mapElectionState;
exports.mapElectionContest = mapElectionContest;
exports.mapPollingSummary = mapPolling;
exports.mapContests = mapContests;
exports.mapResults = mapResults;
exports.mapHistory = mapHistory;