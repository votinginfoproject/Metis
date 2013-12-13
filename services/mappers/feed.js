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

exports.mapFeed = mapFeed;
exports.mapFeedOverview = mapOverview;
exports.mapSource = mapSource;
exports.mapElection = mapElection;