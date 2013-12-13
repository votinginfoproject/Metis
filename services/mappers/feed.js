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

exports.mapFeed = mapFeed;
exports.mapFeedOverview = mapOverview;