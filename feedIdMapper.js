var mongoose = require('mongoose');
var dao = require('./dao/db');
var schemas = require('./dao/schemas');

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
 * Requires a unique datetime to guarantee Hash will be unique
 *
 */
feedIdMapper.getBase36Hash = function(datetime) {
  // hash will be unique since it's based on a unique current datetime
  return (datetime).toString(36);
}

feedIdMapper.makeFriendlyId = function(datetime, name) {
  // replace underscores and spaces with dashes (-)
  var friendlyId = name.replace(/ /g, '-').replace(/_/g, '-') + "-" + feedIdMapper.getBase36Hash(datetime);

  return friendlyId;
}

/*
 * Adding a friendly id into the map of ids available in memory
 */
feedIdMapper.addToUserFriendlyIdMap = function(friendlyId, id) {

  var stringifyId = friendlyId + "";

  console.log(stringifyId + " " + id)

  feedIdMapper.userFriendlyIdMap[stringifyId] = id;

  console.dir(feedIdMapper.userFriendlyIdMap)

}

/*
 * Get the mongo id given a  friendly id from the map
 */
feedIdMapper.getId = function(friendlyId, id) {

  console.log("get.....")
  console.dir(feedIdMapper.userFriendlyIdMap)

  var stringifyId = friendlyId + "";
  return feedIdMapper.userFriendlyIdMap[stringifyId];
}

module.exports = feedIdMapper;
