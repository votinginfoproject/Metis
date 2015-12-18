'use strict';
/*
 * Feeds Service
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * WARNING: This file is almost completely useless. Very few actual
 * calls are made to functions here, most of which could be replaced
 * with a simple $http.get. Additionally, getFeedData is broken, due
 * to its reliance on $appProperties.servicesPath which is itself
 * wrong. The pages that use getFeedData don't work, of which there
 * are few, none of which acutal users seem to be hitting.
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
vipApp.factory('$feedsService', function ($http, $appProperties, $q, $location) {

  return {
    // Feed index page
    // ========================================================
    getFeeds: function () {
      // don't want this service call to ever be cached by IE
      return $http.get($appProperties.servicesPath + "/feeds" + vipApp_ns.cacheBuster());
    },
    getFeedQueue: function (servicePath) {
      // don't want this service call to ever be cached by IE
      return $http.get(servicePath + vipApp_ns.cacheBuster() );
    },

    // Feed error pages (multiple)
    // ========================================================
    getFeedErrors: function (servicePath) {
      // don't want this service call to ever be cached by IE
      return $http.get(servicePath + vipApp_ns.cacheBuster() );
    },

    // Feed overview page
    // ========================================================
    getFeedData: function (feedid) {
      // This service call occurs on every page as it grabs the minimum data needed to populate the UI with the current Feed data
      // Even though as the user navigates from page to page this information should remain the same and hence retrieving the data
      // from the server would not be necessary,

      var deferred = $q.defer();
      var promise = deferred.promise;

      var fetch = $http.get($appProperties.servicesPath + "/feeds/" + feedid);
      fetch.then(function(data){

          // if we have gone back to the Feeds list page, then ignore this request
          if($location.url()=='/feeds'){
            // We ignore the promise and we won't resolve the promise.
            // We won't reject the promise cause that will pass an error back to the Controller
            return;
          } else {
            // otherwise resolve the promise as usual
            deferred.resolve(data);
          }
      });

      promise.success = function(fn) {
        promise.then(function(response) {
          fn(response.data, response.status, response.headers, response.config, response.statusText);
        });
        return promise;
      };

      promise.error = function(fn) {
        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, response.config, response.statusText);
        });
        return promise;
      };

      return deferred.promise;

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
    getFeedCounties: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed results page
    // ========================================================
    getFeedContestResults: function (servicePath) {
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

    // Feed election administration pages (multiple)
    // ========================================================
    getFeedElectionAdministration: function (servicePath) {
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
    getFeedLocalityOverview: function (servicePath) {
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

    // Feed Electoral District pages (multiple)
    // ========================================================
    getFeedElectoralDistrict: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Early Vote Site pages (multiple)
    // ========================================================
    getFeedEarlyVoteSite: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Early Vote Sites pages (multiple)
    // ========================================================
    getFeedEarlyVoteSites: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Polling Location pages (multiple)
    // ========================================================
    getFeedPollingLocation: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Polling Locations pages (multiple)
    // ========================================================
    // can be found above in the overview section

    // Feed Electoral Districts pages (multiple)
    // ========================================================
    getFeedElectoralDistricts: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Precinct Splits page
    // ========================================================
    getFeedPrecinctSplits: function (servicePath) {
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
    },

    // Feed Ballot page
    // ========================================================
    getFeedBallot: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Referendum page
    // ========================================================
    getFeedReferendum: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Referenda page
    // ========================================================
    getFeedReferenda: function (servicePath) {
      return $http.get(servicePath);
    },

    // Feed Contest Result page
    // ========================================================
    getFeedContestResult: function (servicePath) {
      return $http.get(servicePath);
    }
  };
});
