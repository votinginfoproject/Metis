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
    getFeedPollingLocations: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedContests: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedResults: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed source page
    // ========================================================
    getFeedSource: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed election page
    // ========================================================
    getFeedElection: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedElectionContests: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed state page
    // ========================================================
    getFeedState: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedStateEarlyVoteSites: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedStateLocalities: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed localities page
    // ========================================================
    getFeedLocalities: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed locality page
    // ========================================================
    getFeedLocality: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedLocalityEarlyVoteSites: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedLocalityPrecincts: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Precincts page
    // ========================================================
    getFeedPrecincts: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Precinct page
    // ========================================================
    getFeedPrecinct: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctEarlyVoteSites: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctElectoralDistricts: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctPollingLocations: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctPrecinctSplits: function (servicePath) {
      return $http.get(servicePath);
    }

  };
});