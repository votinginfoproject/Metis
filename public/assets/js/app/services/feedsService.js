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
    getFeedOverViewData: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedPollingLocations: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedContests: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    },
    getFeedResults: function () {
      return $http.get($appProperties.servicesPath + "/xxxxxxxxxx");
    }


  };
});