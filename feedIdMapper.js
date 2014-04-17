var mongoose = require('mongoose');
var dao = require('./dao/db');
var schemas = require('./dao/schemas');
var _ = require("underscore");

var feedIdMapper = {};

// a map of Feed ids and user friendly ids
feedIdMapper.userFriendlyIdMap = {};

feedIdMapper.loadUserFriendlyIdMap = function() {
  dao.getFeeds(function (err, data) {

    // add a map of friendly ids to mongo ids into the map
    for(var i=0; i< data.length; i++){
      feedIdMapper.addToUserFriendlyIdMap(data[i].friendlyId, data[i]._id);
    }
  });
}

/*
 * Converting to Base 36
 * Requires a unique datetime to guarantee Hash will be unique
 *
 */
feedIdMapper.getBase36Hash = function(datetime) {
  // hash will be unique since it's based on a unique current datetime
  return (datetime).toString(36);
}

feedIdMapper.makeFriendlyId = function(datetime, name) {
  // replace underscores and spaces with dashes (-)
  var friendlyId = name.replace(/ /g, '-').replace(/_/g, '-') + feedIdMapper.getBase36Hash(datetime);

  return friendlyId;
}

/*
 * Adding a friendly id into the map of ids available in memory
 */
feedIdMapper.addToUserFriendlyIdMap = function(friendlyId, id) {

  var stringifyId = friendlyId + "";
  feedIdMapper.userFriendlyIdMap[stringifyId] = id;
}

/*
 * Get the mongo id given a friendly id from the map
 */
feedIdMapper.getId = function(friendlyId) {

  var stringifyId = friendlyId + "";
  return feedIdMapper.userFriendlyIdMap[stringifyId] + "";
}

/*
 * Get the friendly id given a mongo id from the map
 */
feedIdMapper.getFriendlyId = function(id) {

  var stringifyId =id + "";
  return (_.invert(feedIdMapper.userFriendlyIdMap))[stringifyId] + "";
}

module.exports = feedIdMapper;
