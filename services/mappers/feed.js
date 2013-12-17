/**
 * Created by bantonides on 12/13/13.
 */
var moment = require('moment');

var mapFeed = function(path, feed) {
  return {
    date: moment(feed.election_date).format('YYYY-MM-DD'),
    state: feed.state,
    type: feed.feed_type,
    status: feed.feed_status,
    name: feed.name,
    edit: path + '/' + feed.id
  };
};

var mapOverview = function(path, id) {
  return {
    id: id,
    title: id, //TODO: replace this with a real title for the feed, i.e. 2011-11-03 North Carolina Primary
    error_count: 333, //TODO: replace this with the real error count
    errors: path + '/errors',
    source: path + '/source',
    election: path + '/election',
    polling_locations: path + '/polling',
    contests: path + '/contests',
    results: path + '/results',
    history: path + '/history'
  };
};

var mapSource = function(path, data) {
  return {
    id: 1,
    error_count: 111,
    errors: path + '/errors',
    source_info: {
      name: 'North Carolina State Board of Elections',
      date: moment(new Date()).format('YYYY-MM-DD'),
      description: 'The North Carolina State Board of Elections is the official source of election information for North Carolina.',
      org_url: 'http://www.sboe.state.nc.us/',
      tou_url: 'http://www.sboe.state.nc.us/terms-of-use'
    },
    feed_contact: {
      name: 'Stephen Tyler',
      title: 'Director of Elections',
      phone: '555-555-5555',
      fax: '555-555-5556',
      email: 'stephen@sboe.nc.us'
    }
  };
};

var mapElection = function(path, data) {
  return {
    id: 2,
    error_count: 222,
    errors: path + '/errors',
    date: moment(new Date()).format('YYYY-MM-DD'),
    type: 'Federal',
    statewide: true,
    registration_url: 'http://www.sboe.state.nc.us/registration',
    absentee_url: 'http://www.sboe.state.nc.us/absentee',
    results_url: 'http://www.sboe.state.nc.us/results',
    polling_hours: '8am - 6pm',
    day_of_registration: false,
    registration_deadline: moment(new Date()).format('YYYY-MM-DD'),
    absentee_deadline: moment(new Date()).format('YYYY-MM-DD'),
    state: {
      id: 37,
      name: 'North Carolina',
      locality_count: 100
    },
    contests: path + '/contests'
  };
};

var mapElectionContests = function(path, data) {
  return [
    {
      id: 320004744,
      type: 'General',
      title: 'US President'
    },
    {
      id: 60001,
      type: 'General',
      title: 'State Treasurer'
    },
    {
      id: 60006,
      type: 'Referendum',
      title: 'Proposition 37'
    },
    {
      id: 60007,
      type: 'Judge Retention',
      title: 'Should Judge Carlton Smith be retained?'
    }
  ];
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
exports.mapElectionContest = mapElectionContests;
exports.mapPollingSummary = mapPolling;
exports.mapContests = mapContests;
exports.mapResults = mapResults;
exports.mapHistory = mapHistory;