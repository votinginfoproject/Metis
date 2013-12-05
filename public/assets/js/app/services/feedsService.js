'use strict';
/*
 * Feeds Service
 *
 * Returning promises, allowing the Controller to handle success and error responses appropriately
 *
 */
vipApp.factory('$feedsService', function ($http, $appProperties) {

  return {
    getData: function () {
      return $http.get($appProperties.servicesPath + $appProperties.feedsService);
    }
  };
});