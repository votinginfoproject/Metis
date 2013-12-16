'use strict';
/*
 * Feeds Service
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$feedsService', function ($http, $appProperties) {

  return {
    // Feed index page
    // ========================================================
    getFeeds: function () {
      return $http.get($appProperties.servicesPath + "/feeds");
    },

    // Feed overview page
    // ========================================================
    getFeedData: function (feedid) {
      return $http.get($appProperties.servicesPath + "/feeds/" + feedid);
    },
    getFeedPollingLocations: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedContests: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedResults: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },

    // Feed source page
    // ========================================================
    getFeedSource: function (feedid) {
      return $http.get($appProperties.servicesPath + "/feeds/" + feedid + "/source");
    },
    getFeedContact: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },

    // Feed election page
    // ========================================================
    getFeedElection: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedState: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedElectionContests: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    }
  };
});