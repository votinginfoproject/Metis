'use strict';

vipApp.factory('$feedDataPaths', function ($http) {
  return {
    getFeedResultsPath: function (feedid) { return '/db/feeds/' + feedid + '/results' },
    getFeedValidationsErrorCountPath: function (feedid) { return '/db/feeds/' + feedid + '/validations/errorCount' },
    getFeedContestsPath: function (feedid) { return "/db/feeds/" + feedid + "/contests" },
    getContestsOverviewTablePath: function(feedid) { return "/db/feeds/" + feedid + "/contests/overview" },
    getResponse: function(options, callback) {
      $http.get(options['path']).
        success(function (results, status) {
          options['scope'][options['key']] = results;
          if (callback) {
            callback(results);
          }
        }).
        error(function (results, status) {
          options['scope'][options['key']] = null;
          options['pageHeader']['error'] += options['errorMessage'];
        });
    }
  }
});
