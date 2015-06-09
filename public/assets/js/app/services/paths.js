'use strict';

vipApp.factory('$feedDataPaths', function ($http) {
  return {
    getFeedResultsPath: function (feedid) { return '/db/results?id=' + feedid },
    getFeedValidationsPath: function (feedid) { return '/db/validations?id=' + feedid },
    getFeedValidationsErrorCountPath: function (feedid) { return '/db/validations/errorCount?id=' + feedid },
    getResponse: function(options) {
      $http.get(options['path']).
        success(function (results, status) {
         options['scope'][options['key']] = results;
        }).
        error(function (results, status) {
          options['scope'][options['key']] = null;
          options['pageHeader']['error'] += options['errorMessage'];
        });
    }
  }
});