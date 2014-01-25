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
    getFeedContestCandidate: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Contest page
    // ========================================================
    getFeedContest: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedContestBallot: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedContestContestResults : function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedContestBallotLineResults: function (servicePath) {
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
    getFeedStateElectionAdministration: function (servicePath) {
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
    getFeedLocalityElectionAdministration: function (servicePath) {
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
    },
    getFeedPrecinctStreetSegmentsErrors: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Precinct Electoral District page
    // ========================================================
    getFeedPrecinctElectoralDistrict: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctElectoralDistrictContests: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctElectoralDistrictPrecincts: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctElectoralDistrictPrecinctSplits: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Precinct Splits page
    // ========================================================
    getFeedPrecinctSplits: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctSplitStreetSegmentsErrors: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Precinct Split page
    // ========================================================
    getFeedPrecinctSplit: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctSplitElectoralDistricts: function (servicePath) {
      return $http.get(servicePath);
    },
    getFeedPrecinctSplitPollingLocations: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Candidate page
    // ========================================================
    getFeedCandidate: function (servicePath) {
      return $http.get(servicePath);
    }

  };
});